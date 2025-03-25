from django.db import models
from django.contrib.auth.models import AbstractUser
from MOVIES.models import Genre

class User(AbstractUser):
    followings = models.ManyToManyField(
        'self', symmetrical=False, related_name='followers')
    profile_image = models.ImageField(blank=True)
    like_genres = models.ManyToManyField(
        Genre, related_name='like_users', blank=True)
    hate_genres = models.ManyToManyField(
        Genre, related_name='hate_users', blank=True)
    rate_image = models.CharField(max_length=200, null=True, blank=True,
                                  default='https://img.icons8.com/color/48/medal2-third-place--v1.png')
    score = models.IntegerField(default=0)
    region = models.CharField(max_length=100)
    birth = models.DateField()
    nickname = models.TextField(max_length=20, default='nickname')