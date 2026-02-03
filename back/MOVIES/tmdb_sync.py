import asyncio
import aiohttp
from asgiref.sync import sync_to_async
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from MOVIES.models import (
    Movie,
    Genre,
    Actor,
    Cast,
)
from datetime import datetime

API_KEY = settings.API_KEY
TMDB_MOVIE_URL = "https://api.themoviedb.org/3/movie/"
SEMAPHORE = asyncio.Semaphore(20)


def extract_kr_release_date(movie):
    results = movie.get("release_dates", {}).get("results", [])
    kr = next((r for r in results if r.get("iso_3166_1") == "KR"), None)
    if not kr:
        return None

    candidates = []
    for d in kr.get("release_dates", []):
        if d.get("type") in (2, 3, 4):
            ds = d.get("release_date")
            if ds:
                try:
                    candidates.append(
                        datetime.fromisoformat(ds.replace("Z", "")).date()
                    )
                except ValueError:
                    pass

    return min(candidates) if candidates else None


async def fetch_movie_detail(session, movie_id):
    params = {
        "api_key": API_KEY,
        "language": "ko-KR",
        "append_to_response": "videos,credits,release_dates",
    }
    async with SEMAPHORE:
        async with session.get(
            f"{TMDB_MOVIE_URL}{movie_id}",
            params=params,
        ) as res:
            return await res.json()


def save_movie(movie):
    with transaction.atomic():
        genres = [
            Genre.objects.get_or_create(genre_id=g["id"], defaults={"name": g["name"]})[
                0
            ]
            for g in movie.get("genres", [])
        ]

        actors = []
        casts = []

        for cast in movie.get("credits", {}).get("cast", [])[:10]:
            if cast.get("known_for_department") != "Acting":
                continue

            actor, _ = Actor.objects.get_or_create(
                person_id=cast["id"],
                defaults={
                    "name": cast["name"],
                    "profile_path": cast.get("profile_path"),
                },
            )

            actors.append(actor)
            casts.append(
                Cast(movie_id=movie["id"], actor=actor, cast_order=cast.get("order"))
            )

        Cast.objects.bulk_create(casts, ignore_conflicts=True)

        director = next(
            (
                c["name"]
                for c in movie.get("credits", {}).get("crew", [])
                if c["job"] == "Director"
            ),
            None,
        )

        video = next(
            (
                v["key"]
                for v in movie.get("videos", {}).get("results", [])
                if v.get("site") == "YouTube"
            ),
            None,
        )

        release_date_kr = extract_kr_release_date(movie)

        instance, _ = Movie.objects.update_or_create(
            movie_id=movie["id"],
            defaults={
                "title": movie["title"],
                "overview": movie.get("overview"),
                "release_date": movie.get("release_date") or None,
                "release_date_kr": release_date_kr,
                "popularity": movie.get("popularity", 0),
                "vote_average": movie.get("vote_average", 0),
                "vote_count": movie.get("vote_count", 0),
                "runtime": movie.get("runtime"),
                "poster_path": movie.get("poster_path"),
                "backdrop_path": movie.get("backdrop_path"),
                "director": director,
                "videos": video,
                "adult": movie.get("adult", False),
                "last_detail_fetched_at": timezone.now(),
            },
        )

        instance.genres.add(*genres)
        instance.actors.add(*actors)

        instance.is_complete = instance.check_is_complete()
        instance.save(update_fields=["is_complete"])


def sync_movies(movie_ids):
    async def main():
        existing = await sync_to_async(
            lambda: {
                m.movie_id: m.is_complete
                for m in Movie.objects.filter(movie_id__in=movie_ids)
            },
            thread_sensitive=True,
        )()

        targets = [
            movie_id
            for movie_id in movie_ids
            if movie_id not in existing or existing[movie_id] is False
        ]

        if not targets:
            return

        async with aiohttp.ClientSession() as session:
            tasks = [fetch_movie_detail(session, mid) for mid in targets]
            details = await asyncio.gather(*tasks)

            for detail in details:
                if detail and detail.get("status_code") != 34:
                    await sync_to_async(save_movie, thread_sensitive=True)(detail)

    asyncio.run(main())
