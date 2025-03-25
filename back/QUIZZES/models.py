from django.db import models
from django.conf import settings

class Quiz(models.Model):
  question = models.CharField(max_length=100)
  quiz_writor = models.ForeignKey(
    settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='written_quiz'
  )
  quiz_image = models.ImageField(
    upload_to='quiz_images/',
    default=''
  )

class QuizItem(models.Model):
  quiz = models.ForeignKey(
    Quiz, related_name='items', on_delete=models.CASCADE
  )
  choice_text = models.CharField(max_length=200)
  is_correct = models.BooleanField(default=False)