from django.urls import path
from . import views
from .views import *

app_name = 'COMMUNITY'

urlpatterns = [
  path('', views.review),
]
