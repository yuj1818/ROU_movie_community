from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from .serializers import *
from MOVIES.models import Genre
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Count, Q, F, ExpressionWrapper, IntegerField
from django.db.models.functions import ExtractYear
from django.utils.timezone import now
import requests
from django.conf import settings
from rest_framework.authtoken.models import Token
from allauth.socialaccount.models import SocialAccount
from django.core.files.base import ContentFile

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete(request):
  request.user.delete()
  return Response({'message':f'사용자 {request.user} 탈퇴 완료!'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request, user_pk):
  user = get_object_or_404(User, pk=user_pk)
  if request.method == 'GET':
    serializer = ProfileSerializer(user, context={'request': request})
    if request.user.pk != user_pk:
      data = {
        'isFollowing': user.followers.filter(pk=request.user.pk).exists()
      }
      data.update(serializer.data)
      return Response(data)
    return Response(serializer.data)
  elif request.method == 'PUT':
    if request.user == user:
      serializer = ProfileSerializer(instance=user, data=request.data, partial=True, context={'request': request})
      if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)
      return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def preference(request, pType):
  user = get_object_or_404(User, pk=request.user.pk)
  if request.method == 'GET':
    if pType == 'like':
      serializer = LikeGenreSerializer(user)
    elif pType == 'hate':
      serializer = HateGenreSerializer(user)
    return Response(serializer.data)
  elif request.method == 'PUT':
    genres = request.data['genres'].split(',') if request.data['genres'] else []
    if pType == 'like':
      user.like_genres.clear()
      for genre_name in genres:
        genre = get_object_or_404(Genre, name=genre_name)
        user.like_genres.add(genre)
      serializer = LikeGenreSerializer(user)
    elif pType == 'hate':
      user.hate_genres.clear()
      for genre_name in genres:
        genre = get_object_or_404(Genre, name=genre_name)
        user.hate_genres.add(genre)
      serializer = HateGenreSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, user_pk):
  user = get_object_or_404(User, pk=user_pk)
  if request.user != user:
    if user.followers.filter(pk=request.user.pk).exists():
      user.followers.remove(request.user)
    else:
      user.followers.add(request.user)
    serializer = ProfileSerializer(user, context={'request': request})
    data = {
      'isFollowing': user.followers.filter(pk=request.user.pk).exists()
    }
    data.update(serializer.data)
    return Response(data)
  else:
    return Response({'detail': '본인은 팔로우 불가'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_list(request, user_pk):
  target = request.GET.get('target', '').strip()
  page = request.GET.get('page', 1)
  limit = request.GET.get('limit', 12)

  user = get_object_or_404(User, pk=user_pk)
  if target == 'like':
    movies = user.like_movies.all().order_by('-release_date')
  elif target == 'review':
    movies = Movie.objects.filter(movie_review__review_writor=user).distinct().order_by('-release_date')
  elif target == 'favorite':
    movies = user.favorite_movies.all().order_by('-release_date')
  elif target == 'watch':
    movies = user.watching_movies.all().order_by('-release_date')
  else:
    return Response({"error": "Invalid target parameter"}, status=400)

  paginator = Paginator(movies, limit)
  try:
    result_page = paginator.page(page)
  except PageNotAnInteger:
    result_page = paginator.page(1)
  except EmptyPage:
    result_page = paginator.page(paginator.num_pages)
  
  serializer = MovieListSerializer(result_page, many=True)
  page_data = {
    "current_page": result_page.number,
    "total_pages": paginator.num_pages,
    "has_next": result_page.has_next(),
    "has_previous": result_page.has_previous(),
    "results": serializer.data if result_page != None else []
  }

  return Response(page_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_friend(request):
    user = request.user
    if not user.is_authenticated:
      return Response({'error': '로그인이 필요합니다.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # 1차 추천 (사용자와 좋아하는 장르가 50% 이상 겹치는 유저들을 조회)
    user_like_genres = user.like_genres.all()
    min_common_genres = max(1, len(user_like_genres) // 2)
    potential_users = User.objects.exclude(pk=user.pk).annotate(
      common_genres = Count('like_genres', filter=Q(like_genres__in=user_like_genres))
    ).filter(common_genres__gte=min_common_genres).order_by('-common_genres')

    # 2차 추천 (같은 지역의 비슷한 나이인 사람 추천)
    if potential_users.count() < 5:
      current_year = now().year  # 현재 연도

      additional_users = User.objects.exclude(pk=user.pk).filter(
        region=user.region
      ).annotate(
        birth_year=ExtractYear('birth'),
        age_difference=ExpressionWrapper(
          F('birth_year') - current_year, output_field=IntegerField()
        )
      ).order_by('age_difference')

      additional_users = list(additional_users)[:5]
      potential_users = list(potential_users)  # 리스트 변환
      filtered_additional_users = [user for user in additional_users if user.pk not in {u.pk for u in potential_users}][:5]
      potential_users += filtered_additional_users  # 병합
    
    serializer = UserSerializer(potential_users, many=True, context={'request': request})

    if potential_users:
      return Response(serializer.data)
    else:
      return Response({'message': '추천 친구가 없습니다.'}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def google_login(request):
  code = request.GET.get('code')
  token_url = 'https://oauth2.googleapis.com/token'
  data = {
    'code': code,
    'client_id': settings.SOCIAL_AUTH_GOOGLE_CLIENT_ID,
    'client_secret': settings.SOCIAL_AUTH_GOOGLE_SECRET,
    'redirect_uri': settings.OAUTH2_REDIRECT_URI,
    'grant_type': 'authorization_code'
  }
  token_res = requests.post(token_url, data=data)
  token_res_json = token_res.json()

  access_token = token_res_json.get('access_token')
  info_res = requests.get(f'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}')
  info_res_status = info_res.status_code
  if info_res_status != 200:
    return Response({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)
  info_res_json = info_res.json()
  email = info_res_json.get('email')

  try:
    user = User.objects.get(email=email)
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    serializer = TokenSerializer(token)
    return Response(serializer.data, status=status.HTTP_200_OK)
  except Exception:
    data = {
      'message': '추가 정보 입력이 필요합니다.',
      'email': email,
      'uid': info_res_json.get('user_id')
    }
    return Response(data, status=status.HTTP_202_ACCEPTED)
  
@api_view(['GET'])
@permission_classes([AllowAny])
def kakao_login(request):
  code = request.GET.get('code')
  token_url = 'https://kauth.kakao.com/oauth/token'
  data = {
    'code': code,
    'client_id': settings.SOCIAL_AUTH_KAKAO_CLIENT_ID,
    'redirect_uri': settings.KAKAO_REDIRECT_URI,
    'grant_type': 'authorization_code'
  }
  token_res = requests.post(
    token_url, 
    headers={"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}, 
    data=data
  )
  token_res_json = token_res.json()
  
  access_token = token_res_json.get('access_token')
  info_res = requests.get(
    'https://kapi.kakao.com/v1/oidc/userinfo',
    headers = { "Authorization": f'Bearer {access_token}' }
  )
  if info_res.status_code != 200:
    return Response({'err_msg': 'failed to get userinfo'}, status=status.HTTP_400_BAD_REQUEST)
  info_res_json = info_res.json()
  email = info_res_json.get('email')

  try:
    user = User.objects.get(email=email)
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    serializer = TokenSerializer(token)
    return Response(serializer.data, status=status.HTTP_200_OK)
  except Exception:
    data = {
      'email': email,
      'nickname': info_res_json.get('nickname'),
      'profile_image': ContentFile(requests.get(info_res_json.get('picture')).content),
      'birth': info_res_json.get('birthdate'),
      'region': '전국',
      'username': email,
      'password1': '임시비밀번호입니다',
      'password2': '임시비밀번호입니다',
    }
    serializer = CustomRegisterSerializer(data=data)
    if serializer.is_valid():
      user = serializer.save(request=request)
      SocialAccount.objects.create(user=user, uid=info_res_json.get('sub'), provider="kakao")
      token = Token.objects.get(user=user)
      seializer = TokenSerializer(token)
      return Response(seializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def social_add_info(request):
  if request.method == 'POST':
    serializer = CustomRegisterSerializer(data=request.data)
    if serializer.is_valid():
      user = serializer.save(request=request)
      SocialAccount.objects.create(user=user, provider="google", uid=request.data.get('uid'))
      token = Token.objects.get(user=user)
      serializer = TokenSerializer(token)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)