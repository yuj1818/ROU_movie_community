from django.db import models
from django.conf import settings

class Review(models.Model):
  title = models.CharField(max_length=100)
  content = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  review_movie = models.ForeignKey('MOVIES.Movie', on_delete=models.CASCADE, related_name='movie_review', null=True, blank=True)
  review_writor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='written_review')
  like_review_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_reviews')
  dislike_review_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='dislike_reviews')
  super_review = models.ForeignKey('self', on_delete=models.CASCADE, related_name='reviewed', null=True, blank=True)

class Comment(models.Model):
  content = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  comment_writor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='written_comment')
  super_comment = models.ForeignKey('self', on_delete=models.CASCADE, related_name='commented', null=True, blank=True)
  like_comment_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_comments')
  commented_review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='review_comment')