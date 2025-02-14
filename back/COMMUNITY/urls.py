from django.urls import path
from . import views
from .views import *

app_name = 'COMMUNITY'

urlpatterns = [
  path('', views.review),
  path('<int:review_id>/', views.review_detail),
]
