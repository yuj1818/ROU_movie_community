from django.urls import path
from . import views
from .views import *

app_name = "MOVIES"

"""
- next.js로 마이그레이션 과정에서 like/dislike API를 reaction API로 통합하여 사용
- 마이그레이션 후, like/dislike API 삭제 예정(view.py 함수도 마찬가지)
"""

urlpatterns = [
    path("updateDB/", views.update_DB),
    path("updateDB/upcoming/", views.update_upcoming_movies),
    path("updateDB/<int:movie_id>", views.update_single_movie),
    path("trends/", views.movie_trend),
    path("genre/<int:genre_id>/", views.movie_genre),
    path("sort/", views.movie_sort),
    path("search/", views.search),
    path("recommend/", views.movie_recommend),
    path("<int:movie_id>/", views.movie_detail),
    path("<int:movie_id>/reaction/", views.movie_reaction),
    path("<int:movie_id>/like/", views.movie_like),
    path("<int:movie_id>/dislike/", views.movie_dislike),
    path("<int:movie_id>/watch/", views.movie_watch),
    path("<int:movie_id>/favorite/", views.movie_favorite),
    path("<int:movie_id>/review/", views.movie_reviewing),
]
