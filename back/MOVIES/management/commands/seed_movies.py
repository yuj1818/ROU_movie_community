import asyncio
import aiohttp
from datetime import datetime
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from asgiref.sync import sync_to_async
from MOVIES.models import Movie, Genre, Actor, Cast

API_KEY = settings.API_KEY
DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie"
DETAIL_URL = "https://api.themoviedb.org/3/movie/"
SEMAPHORE = asyncio.Semaphore(20)

DISCOVER_PARAMS_BASE = {
    "api_key": API_KEY,
    "region": "KR",
    "language": "ko-KR",
    "sort_by": "popularity.desc",
    "certification_country": "KR",
    "certification.lte": 19,
    "certification.get": 'ALL',
    "include_adult": "false",
}


async def fetch_json(session, url, params=None):
    async with SEMAPHORE:
        async with session.get(url, params=params) as res:
            return await res.json()


async def discover_movie_ids(session, max_pages=500):
    movie_ids = set()

    for page in range(1, max_pages + 1):
        params = {**DISCOVER_PARAMS_BASE, "page": page}
        data = await fetch_json(session, DISCOVER_URL, params)

        results = data.get("results", [])
        if not results:
            break

        for movie in results:
            movie_ids.add(movie["id"])

    return list(movie_ids)


async def fetch_movie_detail(session, movie_id):
    params = {
        "api_key": API_KEY,
        "language": "ko-KR",
        "append_to_response": "videos,credits",
    }

    data = await fetch_json(session, f"{DETAIL_URL}{movie_id}", params)

    return data


def extract_genres_actors(details):
    genre_map = {}
    actor_map = {}

    for d in details:
        for g in d.get("genres", []):
            genre_map[g["id"]] = g["name"]

        for c in d.get("credits", {}).get("case", []):
            if c.get("known_for_department") == "Acting":
                actor_map[c["id"]] = {
                    "name": c["name"],
                    "profile_path": c.get("profile_path"),
                }

    return genre_map, actor_map


def bulk_insert_genres_actors(genre_map, actor_map):
    Genre.objects.bulk_create(
        [Genre(genre_id=k, name=v) for k, v in genre_map.items()], ignore_conflicts=True
    )

    Actor.objects.bulk_create(
        [Actor(person_id=k, **v) for k, v in actor_map.items()], ignore_conflicts=True
    )


def bulk_insert_movies(details):
    movies = []

    for d in details:
        movies.append(
            Movie(
                movie_id=d["id"],
                title=d["title"],
                adult=d.get("adult", False),
                overview=d.get("overview"),
                release_date=d.get("release_date") or None,
                popularity=d.get("popularity", 0),
                vote_average=d.get("vote_average", 0),
                vote_count=d.get("vote_count", 0),
                runtime=d.get("runtime"),
                poster_path=d.get("poster_path"),
                backdrop_path=d.get("backdrop_path"),
                director=next(
                    (
                        c["name"]
                        for c in d.get("credits", {}).get("crew", [])
                        if c["job"] == 'Director'
                    ),
                    None,
                ),
                videos=next(
                    (
                        v["key"]
                        for v in d.get("videos", {}).get("results", [])
                        if v.get("site") == "YouTube"
                    ),
                    None,
                ),
                last_detail_fetched_at=timezone.now(),
            )
        )

    Movie.objects.bulk_create(movies)


def bulk_insert_casts(details):
    movie_map = {m.movie_id: m for m in Movie.objects.all()}
    actor_map = {a.person_id: a for a in Actor.objects.all()}
    casts = []

    for d in details:
        movie = movie_map.get(d["id"])
        if not movie:
            continue

        for c in d.get("credits", {}).get("cast", []):
            if c.get("known_for_department") != "Acting":
                continue

            actor = actor_map.get(c["id"])
            if actor:
                casts.append(
                    Cast(
                        movie=movie,
                        actor=actor,
                        cast_order=c.get("order"),
                    )
                )

    Cast.objects.bulk_create(casts)


def bulk_save_all(details):
    genre_map, actor_map = extract_genres_actors(details)

    with transaction.atomic():
        bulk_insert_genres_actors(genre_map, actor_map)
        bulk_insert_movies(details)
        bulk_insert_casts(details)

        Movie.objects.filter(
            poster_path__isnull=False,
            backdrop_path__isnull=False,
            overview__isnull=False,
            videos__isnull=False,
        ).update(is_complete=True)


class Command(BaseCommand):
    help = "Initial seed: fetch Korean movies from TMDB"

    def handle(self, *args, **options):
        asyncio.run(self.run())

    async def run(self):
        self.stdout.write("🎬 Discovering movies...")
        async with aiohttp.ClientSession() as session:
            movie_ids = await discover_movie_ids(session)

            self.stdout.write(f"🔍 Found {len(movie_ids)} movies")

            details = await asyncio.gather(
                *[fetch_movie_detail(session, mid) for mid in movie_ids]
            )

        details = [d for d in details if d]
        await sync_to_async(bulk_save_all, thread_sensitive=True)(details)

        self.stdout.write(self.style.SUCCESS("✅ Initial movie seeding completed"))
