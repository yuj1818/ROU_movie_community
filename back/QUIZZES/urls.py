from django.urls import path
from . import views
from .views import *

app_name = 'QUIZZES'

urlpatterns = [
  path('', views.index),
  path('<int:quiz_id>/', views.detail)
]
