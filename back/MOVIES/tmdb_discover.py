import requests
from datetime import date, timedelta
from django.conf import settings

API_KEY = settings.API_KEY
DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie"


def discover_recent_movie_ids(weeks=4):
    start = date.today() - timedelta(weeks=weeks)

    params = {
        "api_key": API_KEY,
        "language": "ko-KR",
        "region": "KR",
        "release_date.gte": start.isoformat(),
        "release_date.lte": date.today().isoformat(),
        "certification_country": "KR",
        "certification.lte": 19,
        "certification.get": 'ALL',
        "include_adult": "false",
        "sort_by": "release_date.desc",
        "page": 1,
        # "with_genres": '10752|10770',  # 부족한 장르 있으면, 특정 장르만 필터링
    }

    ids = set()

    while True:
        res = requests.get(DISCOVER_URL, params=params).json()
        results = res.get("results", [])
        if not results:
            break

        ids.update(m["id"] for m in results)

        if params["page"] >= res.get("total_pages", 1):
            break
        params["page"] += 1

    return list(ids)
