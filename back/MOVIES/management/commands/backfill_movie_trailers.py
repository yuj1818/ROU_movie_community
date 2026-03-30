import asyncio
import aiohttp

from django.conf import settings
from django.core.management.base import BaseCommand
from asgiref.sync import sync_to_async

from MOVIES.models import Movie

API_KEY = settings.API_KEY
DETAIL_URL = "https://api.themoviedb.org/3/movie/"
SEMAPHORE = asyncio.Semaphore(20)


async def fetch_json(session, url, params=None):
    async with SEMAPHORE:
        async with session.get(url, params=params) as res:
            return await res.json()


def extract_video_key(data):
    videos = data.get("videos", {}).get("results", [])

    # Trailer + Official + Youtube
    for v in videos:
        if (
            v.get("type") == "Trailer"
            and v.get("official")
            and v.get("site") == "YouTube"
        ):
            return v["key"]

    # Trailer + Youtube
    for v in videos:
        if v.get("type") == "Trailer" and v.get("site") == "YouTube":
            return v["key"]

    # Any Youtube video
    for v in videos:
        if v.get("site") == "YouTube":
            return v["key"]

    return None


class Command(BaseCommand):
    help = "Backfill movie trailer videos"

    def handle(self, *args, **options):
        asyncio.run(self.run())

    async def run(self):
        movies = await sync_to_async(list)(
            Movie.objects.all().only("movie_id", "videos")
        )

        self.stdout.write(f"🎬 Target movies: {len(movies)}")

        async with aiohttp.ClientSession() as session:

            async def fetch(movie):
                params = {
                    "api_key": API_KEY,
                    "language": "ko-KR",
                    "append_to_response": "videos",
                }

                data = await fetch_json(
                    session,
                    f"{DETAIL_URL}{movie.movie_id}",
                    params,
                )

                movie.videos = extract_video_key(data)
                return movie

            updated_movies = await asyncio.gather(*[fetch(m) for m in movies])

        await sync_to_async(Movie.objects.bulk_update)(
            updated_movies,
            ["videos"],
            batch_size=500,
        )

        self.stdout.write(self.style.SUCCESS("✅ Trailer backfill completed"))
