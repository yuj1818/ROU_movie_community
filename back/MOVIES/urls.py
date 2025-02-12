from django.urls import path
from . import views
from .views import *

app_name = 'MOVIES'

urlpatterns = [
    path('updateDB/', views.update_DB),
]
