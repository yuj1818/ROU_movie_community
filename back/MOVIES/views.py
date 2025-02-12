from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from .update_data import updateDB
from django.http import HttpResponse
from django.conf import settings
from django.db.models import Avg, F, ExpressionWrapper, FloatField
import requests
from datetime import date
from .serializers import *

API_KEY = settings.API_KEY
TMDB_TRENDING_URL = "https://api.themoviedb.org/3/trending/movie/day"

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_trend(request):
  params = {
    "language": "ko-KR",
    "api_key": API_KEY
  }
  response = requests.get(TMDB_TRENDING_URL, params=params).json()
  trend_ids = [res["id"] for res in response["results"]]
  trends = Movie.objects.filter(movie_id__in=trend_ids)
  serializer = MovieSimpleSerializer(trends, many=True)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_genre(request, genre_id):
  genre_movie = Movie.objects.filter(
    genres=genre_id,
    release_date__lte=date.today()
  ).order_by("-popularity")[:30]
  serializer = MovieSimpleSerializer(genre_movie, many=True)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_detail(request, movie_id):
  movie = Movie.objects.get(pk=movie_id)
  serializer = MovieDetailSerializer(movie)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_sort(request, key):
  if key == "latest":
    sort_movies = Movie.objects.filter(release_date__lte=date.today()).order_by("-release_date")[:30]
  elif key == "upcoming":
    sort_movies = Movie.objects.filter(release_date__gt=date.today()).order_by("release_date")[:30]
  elif key == "rate":
    C = Movie.objects.aggregate(Avg("vote_average"))["vote_average__avg"] or 0
    m = 5000

    sort_movies = Movie.objects.filter(
      release_date__lte=date.today(),
      vote_count__gte=m
    ).annotate(
      weighted_rating=ExpressionWrapper(
        (F("vote_count") / (F("vote_count") + m) * F("vote_average")) + 
        (m / (F("vote_count") + m) * C)
        , output_field=FloatField()
      )
    ).order_by("-weighted_rating")[:30]
  else:
    return Response({"error": "Invalid sort number"}, status=status.HTTP_400_BAD_REQUEST)
  return Response(MovieSimpleSerializer(sort_movies, many=True).data)

def update_DB(request):
  try:
    updateDB(request)
    return HttpResponse("Database update completed successfully!")
  except Exception as e:
    return HttpResponse(f"Error Ocurred: {str(e)}", status=500)