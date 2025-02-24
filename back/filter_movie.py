import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ROU.settings")
django.setup()

import traceback
import asyncio
import aiohttp
from asgiref.sync import sync_to_async
from django.conf import settings
from django.db import transaction, DatabaseError
from MOVIES.models import Movie

API_KEY = settings.API_KEY
TMDB_RELEASE_DATES_URL = "https://api.themoviedb.org/3/movie/{movie_id}/release_dates"
SEMAPHORE = asyncio.Semaphore(20)

ADULT_CERTIFICATIONS = {
  "KR": "19", "US": "NC-17", "GB": "18", "DE": "18", "FR": "18", "IT": "VM18",
  "ES": "18", "JP": "R18+", "CN": "18+", "IN": "A", "RU": "18+", "BR": "18", "AU": "R18+"
}

async def fetch_release_dates(session, movie_id):
  params = {"api_key": API_KEY}
  async with SEMAPHORE:
    async with session.get(TMDB_RELEASE_DATES_URL.format(movie_id=movie_id), params=params) as response:
      return await response.json()

def is_adult_movie(release_dates):
  has_kr = False
  is_adult = False
  for entry in release_dates.get("results", []):
    country_code = entry.get("iso_3166_1")
    for release in entry.get("release_dates", []):
      certification = release.get("certification", "")
      if country_code == "KR":
        has_kr = True
        if certification in ["19", "19+"]:
          return True
        else:
          return False
      if not certification:
        continue
      if certification == ADULT_CERTIFICATIONS.get(country_code, "19"):
        is_adult = True
  return is_adult if not has_kr else False

async def filter_adult_movies():
  async with aiohttp.ClientSession() as session:
    movies = await sync_to_async(list)(Movie.objects.all())
    to_delete = []
    tasks = [fetch_release_dates(session, movie.movie_id) for movie in movies]
    results = await asyncio.gather(*tasks)
    
    for movie, data in zip(movies, results):
      if is_adult_movie(data):
        to_delete.append(movie.movie_id)
    
    if to_delete:
      def delete_in_transaction():
        with transaction.atomic():
          Movie.objects.filter(movie_id__in=to_delete).delete()
      await sync_to_async(delete_in_transaction, thread_sensitive=True)()
      print(f"Deleted {len(to_delete)} adult movies.")
    else:
      print("No adult movies found.")

def run():
  asyncio.run(filter_adult_movies())

if __name__ == "__main__":
  run()