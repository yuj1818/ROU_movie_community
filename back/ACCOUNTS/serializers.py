from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model
from MOVIES.serializers import GenreSerializer
from MOVIES.models import Movie
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.crypto import get_random_string
from rest_framework.authtoken.models import Token

User = get_user_model()

class MovieListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('movie_id', 'title', 'poster_path',)     

class CustomRegisterSerializer(RegisterSerializer):
  region = serializers.CharField(max_length=50)
  birth = serializers.DateField()
  nickname = serializers.CharField(max_length=20)

  class Meta:
    model = User
    fields = ('region', 'birth', 'nickname')

  def get_cleaned_data(self):
    data = super().get_cleaned_data()
    data['region'] = self.validated_data.get('region', '')
    data['birth'] = self.validated_data.get('birth', '')
    data['nickname'] = self.validated_data.get('nickname', '')
    data.pop('uid', None)
    password1 = data.get('password1', '')
    username = data.get('username', '')

    if username and password1 and username.lower() in password1.lower():
      raise serializers.ValidationError("비밀번호가 아이디와 너무 유사합니다.")
    
    try:
      validate_password(password1)
    except ValidationError as e:
      raise serializers.ValidationError(f"Password validation error: {', '.join(e.messages)}")

    return data
  
class UserSerializer(serializers.ModelSerializer):
  isFollowing = serializers.SerializerMethodField()
  class Meta:
    model = User
    fields = ('id', 'username', 'profile_image', 'isFollowing', 'nickname')
  
  def get_isFollowing(self, obj):
    request_user = self.context.get('request').user
    return obj.followers.filter(pk=request_user.id).exists()

# 프로필 조회 / 프로필 이미지, 지역, 생년월일 수정
class ProfileSerializer(UserDetailsSerializer):
  hate_genres = GenreSerializer(many=True, read_only=True)
  like_genres = GenreSerializer(many=True, read_only=True)
  followers = UserSerializer(many=True)
  followings = UserSerializer(many=True, read_only=True)

  class Meta:
    model = User
    fields = ('id', 'followers', 'username', 'nickname', 'profile_image', 'region', 'followings', 'hate_genres', 'like_genres', 'birth', 'rate_image', 'score',)

# 사용자 불호 장르 조회/수정
class HateGenreSerializer(serializers.ModelSerializer):
  hate_genres = GenreSerializer(many=True, read_only=True)

  class Meta:
    model = User
    fields = ('id', 'username', 'hate_genres', )

# 사용자 선호 장르 조회/수정
class LikeGenreSerializer(serializers.ModelSerializer):
  like_genres = GenreSerializer(many=True, read_only=True)

  class Meta:
    model = User
    fields = ('id', 'username', 'like_genres', )

class TokenSerializer(serializers.ModelSerializer):
  class Meta:
    model = Token
    fields = ('key', 'user')