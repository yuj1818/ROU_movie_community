from django.urls import path
from . import views
from .views import *
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
  openapi.Info(
    title="Movie API",
    default_version="v1",
    description="영화 정보 API",
    terms_of_service="https://www.google.com/policies/terms/",
    contact=openapi.Contact(email="sonyujeong18@gmail.com"),
    license=openapi.License(name="ROU License")
  ),
)

app_name = 'MOVIES'

urlpatterns = [
    path('updateDB/', views.update_DB),
    path('trends/', views.movie_trend),
    path('genre/<int:genre_id>/', views.movie_genre),
    path('<int:movie_id>/', views.movie_detail),
    path('sort/<str:key>/', views.movie_sort),

    path('swagger/', schema_view.with_ui('swagger'))
]
