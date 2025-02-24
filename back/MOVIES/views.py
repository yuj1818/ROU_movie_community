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
from django.db.models import Avg, F, ExpressionWrapper, FloatField, Q, Count
from django.core.cache import cache
import requests
from datetime import date
from .serializers import *
from .recommend import recommend_movies
from .update_selected_data import updateTrendDB
from COMMUNITY.serializers import ReviewSerializer

API_KEY = settings.API_KEY
TMDB_TRENDING_URL = "https://api.themoviedb.org/3/trending/movie/week"

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_trend(request):
  cache_key = "tmdb_trending_movies"
  cached_data = cache.get(cache_key)
  if cached_data:
    trend_ids = [movie["id"] for movie in cached_data]
    trends = Movie.objects.filter(movie_id__in=trend_ids).order_by("-popularity")
  else:
    params = {
      "language": "ko-KR",
      "api_key": API_KEY
    }
    response = requests.get(TMDB_TRENDING_URL, params=params).json()
    trend_ids = [res["id"] for res in response["results"]]
    trends = Movie.objects.filter(movie_id__in=trend_ids).order_by("-popularity")
    if len(trend_ids) != len(trends):
      updateTrendDB(request, response["results"])
      trends = Movie.objects.filter(movie_id__in=trend_ids).order_by("-popularity")
    # API에서 받은 데이터를 캐시로 저장 (1시간 동안 캐시)
    cache.set(cache_key, response["results"], timeout=3600)
  serializer = MovieSimpleSerializer(trends, many=True)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_genre(request, genre_id):
  cache_key = f"genre_movies_{genre_id}"
  cached_data = cache.get(cache_key)
  if cached_data:
    genre_movie = cached_data
  else:
    genre_movie = Movie.objects.filter(
      genres=genre_id,
      release_date__lte=date.today()
    ).order_by("-popularity")[:30]
    # 캐시 저장 (1일 동안 캐시)
    cache.set(cache_key, genre_movie, timeout=86400)
  serializer = MovieSimpleSerializer(genre_movie, many=True)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_detail(request, movie_id):
  movie = Movie.objects.get(pk=movie_id)
  serializer = MovieSerializer(movie)

  data = {
    "isLike": movie.like_movie_users.filter(pk=request.user.pk).exists(),
    "isFavorite": movie.favorite_movie_users.filter(pk=request.user.pk).exists(),
    "isDislike": movie.dislike_movie_users.filter(pk=request.user.pk).exists(),
    "isWatch": movie.watching_movie_users.filter(pk=request.user.pk).exists()
  }

  data.update(serializer.data)

  return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_sort(request):
  key = request.GET.get("key", "").strip()
  cache_key = f"sorted_movies_{key}"
  cached_data = cache.get(cache_key)

  if cached_data:
    sort_movies = cached_data
  else:
    if key == "popular":
      sort_movies = Movie.objects.filter().order_by("-popularity")[:30]
    elif key == "latest":
      sort_movies = Movie.objects.filter(release_date__lte=date.today()).order_by("-release_date", "popularity")[:30]
    elif key == "upcoming":
      sort_movies = Movie.objects.filter(release_date__gt=date.today()).order_by("popularity")[:30]
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
    # 캐시 저장 (1일 동안 캐시)
    cache.set(cache_key, sort_movies, timeout=86400)
  return Response(MovieSimpleSerializer(sort_movies, many=True).data)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def search(request):
  query = request.GET.get("q", "").strip()
  queryset = Movie.objects.all()
  if query:
    queryset = queryset.filter(
      Q(title__icontains=query) | Q(normalized_title__icontains=query) | Q(overview__icontains=query)
    )
  serializer = MovieSimpleSerializer(queryset, many=True)
  return JsonResponse(serializer.data, safe=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def movie_like(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  user = request.user

  if movie.like_movie_users.filter(pk=user.pk).exists():
    movie.like_movie_users.remove(user)
  else:
    movie.like_movie_users.add(user)

  serializer = MovieLikeSerializer(movie)
  return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def movie_dislike(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  user = request.user

  if movie.dislike_movie_users.filter(pk=user.pk).exists():
    movie.dislike_movie_users.remove(user)
  else:
    movie.dislike_movie_users.add(user)

  serializer = MovieDislikeSerializer(movie)
  return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def movie_watch(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  user = request.user

  if movie.watching_movie_users.filter(pk=user.pk).exists():
    movie.watching_movie_users.remove(user)
  else:
    movie.watching_movie_users.add(user)

  return JsonResponse({"message": "Success"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def movie_favorite(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  user = request.user

  if movie.favorite_movie_users.filter(pk=user.pk).exists():
    movie.favorite_movie_users.remove(user)
  else:
    movie.favorite_movie_users.add(user)
  
  serializer = MovieFavoriteSerializer(movie)
  return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def movie_recommend(request):
  title = request.GET.get("title", "")
  movies = recommend_movies(request.user.id, title)
  serializer = MovieSimpleSerializer(movies, many=True)
  return Response(serializer.data)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def movie_review(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  if request.method == "GET":
    serializer = MovieReviewSerializer(movie)
    return Response(serializer.data)
  elif request.method == "POST":
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      serializer.save(review_writor=request.user, review_movie=movie)
      return Response(serializer.data, status=status.HTTP_201_CREATED)

def update_DB(request):
  try:
    updateDB(request)
    return HttpResponse("Database update completed successfully!")
  except Exception as e:
    return HttpResponse(f"Error Ocurred: {str(e)}", status=500)