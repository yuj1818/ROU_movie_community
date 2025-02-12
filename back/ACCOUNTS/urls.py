from django.urls import path
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
  openapi.Info(
    title="Account API",
    default_version="v1",
    description="회원 정보 API",
    terms_of_service="https://www.google.com/policies/terms/",
    contact=openapi.Contact(email="sonyujeong18@gmail.com"),
    license=openapi.License(name="ROU License")
  ),
)

urlpatterns = [
    # 회원 탈퇴(POST)
    path('delete/', views.delete),
    # 회원 정보 조회(GET)/수정(PUT)
    path('profile/<int:user_pk>/', views.profile),
    # 지역을 고려한 친구 추천
    path('<int:user_pk>/friend/', views.user_friend),
    # 선호, 불호 장르 조회(GET)/수정(PUT)
    path('preference/<str:pType>/', views.preference),
    # 팔로잉(POST)
    path('follow/<int:user_pk>/', views.follow),
]
