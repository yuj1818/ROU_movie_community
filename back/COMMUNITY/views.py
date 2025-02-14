from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review(request):
  if request.method == "GET":
    page = int(request.GET.get("page", 1))
    sort_key = int(request.GET.get("sort", 0))
    reviews = Review.objects.annotate(
      comment_count = Count("review_comment", distinct=True),
      like_count = Count("like_review_users", distinct=True),
    )
    # 최신 순
    if sort_key == 0:
      reviews = reviews.order_by("-pk")
    # 좋아요 많은 순
    elif sort_key == 1:
      reviews = reviews.order_by("-like_count")
    # 댓글 많은 순
    elif sort_key == 2:
      reviews = reviews.order_by("-comment_count")
      
    paginator = Paginator(reviews, 10)
    try:
      reviews_page = paginator.page(page)
    except PageNotAnInteger:
      reviews_page = paginator.page(1)
    except EmptyPage:
      reviews_page = paginator.page(paginator.num_pages)
    
    serializer = ReviewListSerializer(reviews_page, many=True)
    page_data = {
      "current_page": reviews_page.number,
      "total_pages": paginator.num_pages,
      "has_next": reviews_page.has_next(),
      "has_previous": reviews_page.has_previous(),
      "results": serializer.data
    }
    return Response(page_data)
  elif request.method == "POST":
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      serializer.save(review_writor=request.user)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review_detail(request, review_id):
  review = get_object_or_404(Review, pk=review_id)
  if request.method == "GET":
    serializer = ReviewSerializer(review)
    return Response(serializer.data)
  elif request.method == "PATCH":
    if request.user == review.review_writor:
      serializer = ReviewSerializer(review, data=request.data, partial=True)
      if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)
    else:
      return Response({"message": "작성자 본인만 수정 및 삭제가 가능합니다"}, status=status.HTTP_401_UNAUTHORIZED)
  