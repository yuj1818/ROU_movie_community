from django.urls import path
from . import views
from .views import *

app_name = "MOVIES"

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
    path("<int:movie_id>/watch/", views.movie_watch),
    path("<int:movie_id>/favorite/", views.movie_favorite),
    path("<int:movie_id>/review/", views.movie_reviewing),
]
