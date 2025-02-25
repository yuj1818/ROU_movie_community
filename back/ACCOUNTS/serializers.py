from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import TokenSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model
from MOVIES.serializers import GenreSerializer
from MOVIES.models import Movie
from rest_framework.authtoken.models import Token
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

# 사용자가 좋아요/위시리스트/평점을 준 영화 목록 조회
class UserMovieListSerializer(serializers.ModelSerializer):

    class MovieSerializer(serializers.ModelSerializer):

        class Meta:
            model = Movie
            fields = ('movie_id', 'title', 'poster_path',)

    # 좋아요한 영화 목록
    like_movies = MovieSerializer(many=True)
    # 싫어요한 영화 목록
    dislike_movies = MovieSerializer(many=True)
    # 찜한 영화 목록
    watching_movies = MovieSerializer(many=True)
    # 시청한 영화 목록
    favorite_movies = MovieSerializer(many=True)

    class Meta:
        model = User
        # 사용자 id, 평가한 영화 목록, 좋아요한 영화 목록, 위시리스트에 담은 영화 목록
        fields = ('like_movies', 'dislike_movies',
                  'watching_movies', 'favorite_movies',)

class CustomRegisterSerializer(RegisterSerializer):
  region = serializers.CharField(max_length=50)
  birth = serializers.DateField()
  class Meta:
    model = User
    fields = ('region', 'birth',)

  def get_cleaned_data(self):
    data = super().get_cleaned_data()
    data['region'] = self.validated_data.get('region', '')
    data['birth'] = self.validated_data.get('birth', '')

    password1 = data.get('password1', '')
    username = data.get('username', '')

    if username and password1 and username.lower() in password1.lower():
      raise serializers.ValidationError("비밀번호가 아이디와 너무 유사합니다.")
    
    try:
      validate_password(password1)
    except ValidationError as e:
      raise serializers.ValidationError(f"Password validation error: {', '.join(e.messages)}")

    return data

# 프로필 조회 / 프로필 이미지, 지역, 생년월일 수정
class ProfileSerializer(UserDetailsSerializer):
  class UserSerializer(serializers.ModelSerializer):
    isFollowing = serializers.SerializerMethodField()
    class Meta:
      model = User
      fields = ('id', 'username', 'profile_image', 'isFollowing')
    
    def get_isFollowing(self, obj):
      request_user = self.context.get('request').user
      return obj.followers.filter(pk=request_user.id).exists()

  hate_genres = GenreSerializer(many=True, read_only=True)
  like_genres = GenreSerializer(many=True, read_only=True)
  followers = UserSerializer(many=True)
  followings = UserSerializer(many=True, read_only=True)

  class Meta:
    model = User
    fields = ('id', 'followers', 'username', 'profile_image', 'region', 'followings', 'hate_genres', 'like_genres', 'birth', 'rate_image', 'score',)

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

class CustomTokenSerializer(TokenSerializer):
   class Meta:
    model = Token
    fields = ('key', 'user',)