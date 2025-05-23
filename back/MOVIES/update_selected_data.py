import asyncio
import aiohttp
from django.conf import settings
from django.db import transaction
from MOVIES.models import *
from datetime import datetime, timedelta
from asgiref.sync import sync_to_async

API_KEY = settings.API_KEY
TMDB_DETAIL_INFO_URL = "https://api.themoviedb.org/3/movie/"
SEMAPHORE = asyncio.Semaphore(20)

ADULT_CERTIFICATIONS = {
  "KR": "19", "US": "NC-17", "GB": "18", "DE": "18", "FR": "18", "IT": "VM18",
  "ES": "18", "JP": "R18+", "CN": "18+", "IN": "A", "RU": "18+", "BR": "18", "AU": "R18+"
}

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

async def fetch_json(session, url, params):
  async with SEMAPHORE:
    async with session.get(url, params=params) as response:
      return await response.json()
    
async def get_movie_details(session, movie_id):
  params = {
    "api_key": API_KEY,
    "language": "ko-KR",
    "append_to_response": "videos,credits,release_dates"
  }
  return await fetch_json(session, f'{TMDB_DETAIL_INFO_URL}{movie_id}', params)

def save_movie(movie, isFiltering):
  if isFiltering and is_adult_movie(movie.get("release_dates", {})):
    return

  with transaction.atomic():
    genres = [
      Genre.objects.get_or_create(
        genre_id=g["id"],
        defaults={
          "name": g["name"]
        }
      )[0]
      for g in movie.get("genres", [])
    ]
    
    actors = []
    for actor_data in movie.get("credits", {}).get("cast", []):
      if actor_data["known_for_department"] == "Acting":
        actor, created = Actor.objects.get_or_create(
          person_id=actor_data["id"],
          defaults={
            "name": actor_data["name"],
            "profile_path": actor_data.get("profile_path")
          }
        )

        Cast.objects.get_or_create(
          movie_id=movie["id"],
          actor=actor,
          defaults={
            "cast_order": actor_data.get("order")
          }
        )

        actors.append(actor)

    director = next((c["name"] for c in movie.get("credits", {}).get("crew", []) if c["job"] == "Director"), None)
    videos = next((v["key"] for v in movie.get("videos", {}).get("results", []) if "key" in v), None)

    movie_data = {
      "title": movie["title"],
      "overview": movie.get("overview", ""),
      "release_date": movie.get("release_date") or None,
      "popularity": movie.get("popularity", 0),
      "vote_average": movie.get("vote_average", 0),
      "vote_count": movie.get("vote_count", 0),
      "runtime": movie.get("runtime"),
      "director": director,
      "videos": videos,
      "poster_path": movie.get("poster_path"),
      "backdrop_path": movie.get("backdrop_path"),
      "adult": movie.get("adult", False),
    }

    movie_instance, _ = Movie.objects.update_or_create(
      movie_id=movie["id"],
      release_date=movie.get("release_date") or None,
      defaults=movie_data
    )

    movie_instance.genres.set(genres)
    movie_instance.actors.set(actors)

def updateTrendDB(request, movies):
  async def main():
    async with aiohttp.ClientSession() as session:
      get_existing_ids = sync_to_async(lambda: set(Movie.objects.values_list("movie_id", flat=True)), thread_sensitive=True)
      existing_ids = await get_existing_ids()
      new_movie_ids = [movie["id"] for movie in movies if movie["id"] not in existing_ids]

      tasks = [get_movie_details(session, movie_id) for movie_id in new_movie_ids]
      movies_data = await asyncio.gather(*tasks)

      for movie_data in movies_data:
        await sync_to_async(save_movie, thread_sensitive=True)(movie_data, True)
  
  asyncio.run(main())

def updateSelectedMovie(request, movie_id):
  async def main():
    async with aiohttp.ClientSession() as session:
      movie_data = await get_movie_details(session, movie_id)
      await sync_to_async(save_movie)(movie_data, False)

  asyncio.run(main())