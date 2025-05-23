from django.urls import path
from . import views
from .views import *

app_name = 'MOVIES'

urlpatterns = [
  path('updateDB/', views.update_DB),
  path('updateDB/<int:movie_id>', views.update_single_movie),
  path('trends/', views.movie_trend),
  path('genre/<int:genre_id>/', views.movie_genre),
  path('<int:movie_id>/', views.movie_detail),
  path('sort/', views.movie_sort),
  path('search/', views.search),
  path('like/<int:movie_id>/', views.movie_like),
  path('dislike/<int:movie_id>/', views.movie_dislike),
  path('watch/<int:movie_id>/', views.movie_watch),
  path('favorite/<int:movie_id>/', views.movie_favorite),
  path('recommend/', views.movie_recommend),
  path('review/<int:movie_id>/', views.movie_reviewing),
]
