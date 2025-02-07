# import requests
# import json
# from django.conf import settings
# from MOVIES.models import *
# from MOVIES.serializers import *

# API_KEY = settings.API_KEY
# # TMDB API 인기있는 영화
# TMDB_POPULAR_BASE_URL = 'https://api.themoviedb.org/3/movie/popular'
# # TMDB API Genre 정보
# TMDB_GENRE_BASE_URL = 'https://api.themoviedb.org/3/genre/movie/list'
# # TMDB API 상세 정보
# TMDB_DETAIL_INFO_BASE_URL = 'https://api.themoviedb.org/3/movie/'
# # TMDB API 현재 상영중인 영화
# TMDB_TRENDING_BASE_URL = 'https://api.themoviedb.org/3/trending/movie/day'

# movie_res = []

# for page in range(1, 501):
#   params = {
#     'language': 'ko-KR',
#     'api_key': API_KEY,
#     'page': page
#   }
#   response = requests.get(TMDB_POPULAR_BASE_URL, params=params)
#   data = response.json()
#   movie_list = data['results']

#   for movie in movie_list:
#     try:
#       movie_id = movie['id']
#       params = {
#         'language': 'ko-KR',
#         'api_key': API_KEY,
#         'append_to_response': 'credits, videos'
#       }

