# Generated by Django 5.1.6 on 2025-02-13 00:55

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MOVIES', '0002_movie_favorite_movie_users'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='dislike_movie_users',
            field=models.ManyToManyField(blank=True, related_name='dislike_movies', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='movie',
            name='like_movie_users',
            field=models.ManyToManyField(blank=True, related_name='like_movies', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='movie',
            name='watching_movie_users',
            field=models.ManyToManyField(blank=True, related_name='watching_movies', to=settings.AUTH_USER_MODEL),
        ),
    ]
