import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ROU.settings")
django.setup()

import traceback
import asyncio
import aiohttp
from asgiref.sync import sync_to_async
from django.conf import settings
from django.db import transaction
from MOVIES.models import *
from MOVIES.serializers import *
from django.db import DatabaseError, IntegrityError

API_KEY = settings.API_KEY
# TMDB API 인기있는 영화
TMDB_POPULAR_BASE_URL = "https://api.themoviedb.org/3/movie/popular"
# TMDB API Genre 정보
TMDB_GENRE_BASE_URL = "https://api.themoviedb.org/3/genre/movie/list"
# TMDB API 상세 정보
TMDB_DETAIL_INFO_BASE_URL = "https://api.themoviedb.org/3/movie/"
# TMDB API 현재 상영중인 영화
TMDB_TRENDING_BASE_URL = "https://api.themoviedb.org/3/trending/movie/day"
# TMDB API 평점 높은 영화
TMDB_RATING_BASE_URL = "https://api.themoviedb.org/3/movie/top_rated"

SEMAPHORE = asyncio.Semaphore(20)

ADULT_CERTIFICATIONS = {
  "KR": "19", "US": "NC-17", "GB": "18", "DE": "18", "FR": "18", "IT": "VM18",
  "ES": "18", "JP": "R18+", "CN": "18+", "IN": "A", "RU": "18+", "BR": "18", "AU": "R18+"
}

async def fetch_genres(session):
  params = {
    "api_key": API_KEY,
    "language": "ko-KR"
  }

  async with SEMAPHORE:
    async with session.get(TMDB_GENRE_BASE_URL, params=params) as response:
      return await response.json()
    
def process_genres(genres_data):
  genre_instances = []
  for genre_data in genres_data.get("genres", []):
    genre_instance, _ = Genre.objects.get_or_create(
      genre_id = genre_data["id"],
      defaults = {
        "name": genre_data["name"]
      }
    )
    genre_instances.append(genre_instance)
  return genre_instances

def is_adult_movie(release_dates):
  has_kr = False
  is_adult = False
  for entry in release_dates.get("results", []):
    country_code = entry.get("iso_3166_1")
    for release in entry.get("release_dates", []):
      certification = release.get("certification")
      if country_code == "KR":
        has_kr = True
        if certification == "19":
          return True
        else:
          return False
      if not certification:
        continue
      if certification == ADULT_CERTIFICATIONS.get(country_code, "19"):
        is_adult = True
  return is_adult if not has_kr else False

async def fetch_movies(session, page):
  params = {
    "api_key": API_KEY,
    "language": "ko-KR",
    "page": page
  }
  async with SEMAPHORE:
    async with session.get(TMDB_RATING_BASE_URL, params=params) as response:
      return await response.json()
    
async def fetch_movie_details(session, movie):
  movie_id = movie["id"]
  url = f'{TMDB_DETAIL_INFO_BASE_URL}{movie_id}'
  params = {
    "api_key": API_KEY,
    "language": "ko-KR",
    "append_to_response": "videos,credits,release_dates"
  }

  async with SEMAPHORE:
    async with session.get(url, params=params) as response:
      movie_detail = await response.json()
      if is_adult_movie(movie_detail.get("release_dates", {})):
        return None
      videos = movie_detail.get("videos", {}).get("results", [])
      if videos:
        movie['videos'] = videos[0].get("key")
      else:
        movie['videos'] = None
      
      return movie, movie_detail

def process_movie_orm(movie, movie_detail):
  runtime = movie_detail.get("runtime")
  cast_list = movie_detail.get("credits", {}).get("cast", [])
  crew_list = movie_detail.get("credits", {}).get("crew", [])

  actor_instances_dict = {}

  for actor in cast_list:
      if actor["known_for_department"] == "Acting" and actor["id"] not in actor_instances_dict:
        actor_instance, created = Actor.objects.get_or_create(
            person_id=actor["id"], 
            defaults={"name": actor["name"], "profile_path": actor.get("profile_path")}
        )
        actor_instances_dict[actor["id"]] = actor_instance

        Cast.objects.get_or_create(
          movie_id=movie["id"],
          actor=actor_instance,
          defaults={"cast_order": actor.get("order")}
        )

  director_name = next((crew["name"] for crew in crew_list if crew["job"] == "Director"), None)

  genre_instances_dict = {}
  for genre_data in movie_detail.get("genres", []):
      if genre_data["id"] not in genre_instances_dict:
          genre_instance, created = Genre.objects.get_or_create(
              genre_id=genre_data["id"], 
              defaults={"name": genre_data["name"]}
          )
          genre_instances_dict[genre_data["id"]] = genre_instance

  movie_data = {
    "title": movie["title"],
    "overview": movie.get("overview", ""),
    "release_date": movie.get("release_date") or None,
    "popularity": movie.get("popularity", 0),
    "vote_average": movie.get("vote_average", 0),
    "vote_count": movie.get("vote_count", 0),
    "runtime": runtime,
    "director": director_name,
    "videos": movie.get("videos"),
    "poster_path": movie.get("poster_path"),
    "backdrop_path": movie.get("backdrop_path"),
    "adult": movie.get("adult", False)
  }

  try:
    movie_instance, _ = Movie.objects.update_or_create(
      movie_id=movie["id"],
      release_date=movie.get("release_date") or None,
      defaults=movie_data
    )
  except IntegrityError:
    return None

  return movie_instance, genre_instances_dict.keys(), actor_instances_dict.keys()

def save_movies_to_db(movies):
  try:
    with transaction.atomic():
      for movie, movie_detail in movies:
        result = process_movie_orm(movie, movie_detail)
        if result is None: continue
        movie_instance, genres, actors = result
        if movie_instance:
          genres = Genre.objects.filter(genre_id__in=genres)
          actors = Actor.objects.filter(person_id__in=actors)
          movie_instance.actors.set(actors)
          movie_instance.genres.set(genres)
          movie_instance.save()

  except DatabaseError as e:
    print(f'데이터베이스 오류 발생: {e}')
    traceback.print_exc()
  except Exception as e:
    print(f'예기치 않은 오류 발생: {e}')
    traceback.print_exc()

def run():
  async def main():
    async with aiohttp.ClientSession() as session:
      genre_data = await fetch_genres(session)
      await sync_to_async(process_genres)(genre_data)

      movie_tasks = [fetch_movies(session, page) for page in range(1, 501)]
      movie_results = await asyncio.gather(*movie_tasks)

      all_movies = [movie for page in movie_results for movie in page.get("results", [])]
      detail_tasks = [fetch_movie_details(session, movie) for movie in all_movies]
      movie_details = await asyncio.gather(*detail_tasks)
      filtered_movies = [m for m in movie_details if m]
      await sync_to_async(save_movies_to_db)(filtered_movies) 
  
  asyncio.run(main())

if __name__ == "__main__":
  run()