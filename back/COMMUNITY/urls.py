from django.urls import path
from . import views
from .views import *

app_name = "COMMUNITY"

urlpatterns = [
    path("", views.review),
    path("<int:review_id>/", views.review_detail),
    path("<int:review_id>/reaction/", views.review_reaction),
    path("comment/<int:review_id>/", views.review_comment),
    path("comment/<int:review_id>/<int:comment_id>/", views.review_comment),
    path("comment/<int:comment_id>/like/", views.comment_like),
]
