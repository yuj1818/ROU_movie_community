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

# TMDB Popular 영화 목록
class Movie(models.Model):
  movie_id = models.IntegerField(primary_key=True)
  title = models.CharField(max_length=100)
  adult = models.BooleanField()
  backdrop_path = models.CharField(max_length=60, blank=True, null=True)
  release_date = models.DateField(blank=True, null=True)
  vote_average = models.FloatField()
  vote_count = models.IntegerField()
  poster_path = models.CharField(max_length=60, blank=True, null=True)
  popularity = models.FloatField()
  overview = models.TextField(null=True, blank=True)
  genres = models.ManyToManyField(Genre, blank=True)
  runtime = models.IntegerField(null=True, blank=True)
  actors = models.ManyToManyField(Actor, blank=True)
  director = models.CharField(max_length=50, null=True, blank=True)
  videos = models.TextField(null=True, blank=True)
  normalized_title = models.CharField(max_length=100, blank=True)

  like_movie_users = models.ManyToManyField(
    settings.AUTH_USER_MODEL, related_name='like_movies', blank=True
  )
  dislike_movie_users = models.ManyToManyField(
    settings.AUTH_USER_MODEL, related_name='dislike_movies', blank=True
  )
  watching_movie_users = models.ManyToManyField(
    settings.AUTH_USER_MODEL, related_name='watching_movies', blank=True
  )
  favorite_movie_users = models.ManyToManyField(
    settings.AUTH_USER_MODEL, related_name='favorite_movies', blank=True
  )

  def save(self, *args, **kwargs):
    self.normalized_title = self.title.replace(" ", "")
    super().save(*args, **kwargs)

class Cast(models.Model):
  movie = models.ForeignKey(Movie, related_name='movie_actors', on_delete=models.CASCADE)
  actor = models.ForeignKey(Actor, related_name='actor_movies', on_delete=models.CASCADE)
  cast_order = models.IntegerField(null=True, blank=True)

  class Meta:
    unique_together = ('movie', 'actor')