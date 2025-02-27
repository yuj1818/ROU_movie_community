import datetime
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
    return Response(serializer.data);
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
def user_friend(request):
    me = get_object_or_404(User, pk=request.user.pk)
    # user = request.user # username이 출력
    serializer = ProfileSerializer(me, context={'request': request})  # 나의 정보를 추출
    # 연도 추출 : 나의 나이 +-3
    year = int(serializer.data.get('birth')[:4])
    first_date = datetime.date(year - 3, 1, 1)
    last_date = datetime.date(year + 3, 12, 31)
    # 나를 제외하고 지역이 같은 사람을 추출
    friends = User.objects.filter(
        region=serializer.data.get('region'),
        birth__range=(first_date, last_date)).exclude(pk=request.user.pk)
    serializer = ProfileSerializer(friends, many=True, context={'request': request})
    if friends.exists():
        return Response(serializer.data)
    else:
        data = {
            'content': f'추천 친구가 없습니다.',
        }
        return Response(data, status=status.HTTP_204_NO_CONTENT)