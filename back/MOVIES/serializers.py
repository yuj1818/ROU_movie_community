from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class ActorSerializer(serializers.ModelSerializer):
  cast_order = serializers.IntegerField(source='movie_actors__cast_order', read_only=True)

  class Meta:
    model = Actor
    fields = '__all__'
    read_only_fields = ('person_id',)

class GenreSerializer(serializers.ModelSerializer):
  class Meta:
    model = Genre
    fields = '__all__'
    read_only_fields = ('genre_id',)

class MovieSerializer(serializers.ModelSerializer):
  actors = serializers.SerializerMethodField()
  genres = GenreSerializer(many=True)
  like_movie_users_count = serializers.IntegerField(source='like_movie_users.count', read_only=True)
  dislike_movie_users_count = serializers.IntegerField(source='dislike_movie_users.count', read_only=True)
  favorite_movie_users_count = serializers.IntegerField(source='favorite_movie_users.count', read_only=True)
  
  class Meta:
    model = Movie
    read_only_fields = ('movie_id', 'release_date')
    exclude = ('like_movie_users', 'dislike_movie_users', 'favorite_movie_users', 'watching_movie_users')
    

  def get_actors(self, obj):
    cast_list = Cast.objects.filter(movie=obj).order_by('cast_order')
    actor_list = [cast.actor for cast in cast_list]
    return ActorSerializer(actor_list, many=True).data

class MovieSimpleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('movie_id', 'title', 'poster_path', 'backdrop_path', 'videos', 'overview',)

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username',)

class MovieLikeSerializer(serializers.ModelSerializer):
  like_movie_users = UserSerializer(many=True, read_only=True)
  like_movie_users_count = serializers.IntegerField(source='like_movie_users.count', read_only=True)

  class Meta:
    model = Movie
    fields = ('movie_id', 'like_movie_users', 'like_movie_users_count')

class MovieDislikeSerializer(serializers.ModelSerializer):
  dislike_movie_users = UserSerializer(many=True, read_only=True)
  dislike_movie_users_count = serializers.IntegerField(source='dislike_movie_users.count', read_only=True)

  class Meta:
    model = Movie
    fields = ('movie_id', 'dislike_movie_users', 'dislike_movie_users_count')