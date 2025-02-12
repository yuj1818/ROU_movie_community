from rest_framework import serializers
from .models import *

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

class MovieDetailSerializer(serializers.ModelSerializer):
  actors = serializers.SerializerMethodField()
  genres = GenreSerializer(many=True)
  
  class Meta:
    model = Movie
    fields = '__all__'

  def get_actors(self, obj):
    cast_list = Cast.objects.filter(movie=obj).order_by('cast_order')
    actor_list = [cast.actor for cast in cast_list]
    return ActorSerializer(actor_list, many=True).data

class MovieSimpleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('movie_id', 'title', 'poster_path', 'backdrop_path', 'videos', 'overview',)

class MovieSerializer(serializers.ModelSerializer):
  class GenreSerializer(serializers.ModelSerializer):
    class Meta:
      model = Genre
      fields = '__all__'
  
  genres = serializers.PrimaryKeyRelatedField(
    many = True,
    queryset = Genre.objects.all(),
    required = False
  )

  actors = serializers.PrimaryKeyRelatedField(
    many = True,
    queryset = Actor.objects.all(),
    required = False
  )

  class Meta:
    model = Movie
    fields = '__all__'
    read_only_fields = ('movie_id', 'release_date')