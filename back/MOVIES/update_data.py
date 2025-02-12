import asyncio
import aiohttp
from django.conf import settings
from django.db import transaction
from MOVIES.models import *
from datetime import datetime, timedelta
from asgiref.sync import sync_to_async

API_KEY = settings.API_KEY
TMDB_DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie"
TMDB_DETAIL_INFO_URL = "https://api.themoviedb.org/3/movie/"
SEMAPHORE = asyncio.Semaphore(20)

async def fetch_json(session, url, params):
  async with SEMAPHORE:
    async with session.get(url, params=params) as response:
      return await response.json()

async def get_new_movie_ids(session, start_date):
  params = {
    "api_key": API_KEY, 
    "primary_release_date.gte": start_date, 
    "sort_by": "release_date.desc"
  }
  data = await fetch_json(session, TMDB_DISCOVER_URL, params)

  get_existing_ids = sync_to_async(lambda: set(Movie.objects.values_list("movie_id", flat=True)), thread_sensitive=True)
  existing_ids = await get_existing_ids()
  return [movie["id"] for movie in data.get("results", []) if movie["id"] not in existing_ids]

async def get_movie_details(session, movie_id):
  params = {
    "api_key": API_KEY,
    "language": "ko-KR",
    "append_to_response": "videos,credits"
  }
  return await fetch_json(session, f'{TMDB_DETAIL_INFO_URL}{movie_id}', params)

def save_movie(movie):
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

def updateDB(request):
  async def main():
    start_date = (datetime.today() - timedelta(weeks=1)).strftime("%Y-%m-%d")
    async with aiohttp.ClientSession() as session:
      new_movie_ids = await get_new_movie_ids(session, start_date)
      if not new_movie_ids:
        print("No Updated Data")
        return

      tasks = [get_movie_details(session, movie_id) for movie_id in new_movie_ids]
      movies_data = await asyncio.gather(*tasks)

      for movie_data in movies_data:
        await sync_to_async(save_movie, thread_sensitive=True)(movie_data)
  
  asyncio.run(main())