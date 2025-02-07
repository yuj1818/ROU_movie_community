from rest_framework import serializers
from .models import *

class ActorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Actor
    fields = '__all__'
    read_only_fields = ('person_id',)

class GenreSerializer(serializers.ModelSerializer):
  class Meta:
    model = Genre
    fields = '__all__'
    read_only_fields = ('genre_id',)

class TrendSerializer(serializers.ModelSerializer):
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
    model = Trend
    fields = '__all__'
    read_only_fields = ('movie_id', 'related_date',)

class MovieDetailSerializer(serializers.ModelSerializer):
  actors = ActorSerializer(many=True)
  genres = GenreSerializer(many=True)
  
  class Meta:
    model = Movie
    fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
  class GenreSerializer(serializers.ModelSerializer):
    class Meta:
      model = Genre
      fields = '__all__'
  
  genres = serializers.PrimaryKeyRelatedField(
    many = True,
    queryset = Genre.object.all(),
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