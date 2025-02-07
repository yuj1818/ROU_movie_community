from django.db import models
from django.conf import settings

# Create your models here.

# TMDB People 목록
class Actor(models.Model):
  person_id = models.IntegerField()
  name = models.CharField(max_length=100)
  profile_path = models.CharField(max_length=60, blank=True, null=True)

# TMDB Genre 목록
class Genre(models.Model):
  genre_id = models.IntegerField()
  name = models.CharField(max_length=10)

# TMDB Trend 목록
class Trend(models.Model):
  movie_id = models.IntegerField(primary_key=True)
  title = models.CharField(max_length=100)
  poster_path = models.CharField(max_length=60, blank=True, null=True)
  videos = models.TextField(null=True, blank=True)
  def create(self, validated_data):
    movie_id = validated_data.pop('movie_id', None)
    instance = Trend.objects.create(**validated_data, movie_id=movie_id)
    return instance