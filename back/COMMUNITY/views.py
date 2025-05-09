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
      reviews = reviews.order_by("-pk", "-like_count", "-comment_count")
    # 좋아요 많은 순
    elif sort_key == 1:
      reviews = reviews.order_by("-like_count", "-comment_count", "-pk")
    # 댓글 많은 순
    elif sort_key == 2:
      reviews = reviews.order_by("-comment_count", "-like_count", "-pk")
      
    paginator = Paginator(reviews, 10)
    try:
      reviews_page = paginator.page(page)
    except PageNotAnInteger:
      reviews_page = paginator.page(1)
    except EmptyPage:
      reviews_page = paginator.page(paginator.num_pages)
    
    serializer = ReviewListSerializer(reviews_page, many=True, context={'request': request})
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
    
@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review_detail(request, review_id):
  review = get_object_or_404(Review, pk=review_id)
  if request.method == "GET":
    serializer = ReviewSerializer(review)
    data = {
      'isLike': review.like_review_users.filter(pk=request.user.pk).exists(),
      'isDislike': review.dislike_review_users.filter(pk=request.user.pk).exists(),
    }
    data.update(serializer.data)
    return Response(data)
  elif request.method == "PUT":
    if request.user == review.review_writor:
      serializer = ReviewSerializer(review, data=request.data, partial=True)
      if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)
    else:
      return Response({"message": "작성자 본인만 수정 및 삭제가 가능합니다"}, status=status.HTTP_401_UNAUTHORIZED)
  elif request.method == "DELETE":
    if request.user == review.review_writor:
      review.delete()
      return Response({"message": f"게시글 {review_id}번이 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)
    else:
      return Response({"message": "작성자 본인만 수정 및 삭제가 가능합니다"}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def review_like(request, review_id):
  review = get_object_or_404(Review, pk=review_id)
  user = request.user
  if review.like_review_users.filter(pk=user.pk).exists():
    review.like_review_users.remove(user)
  else:
    review.like_review_users.add(user)

  serializer = ReviewLikeSerializer(review)
  return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def review_dislike(request, review_id):
  review = get_object_or_404(Review, pk=review_id)
  user = request.user
  if review.dislike_review_users.filter(pk=user.pk).exists():
    review.dislike_review_users.remove(user)
  else:
    review.dislike_review_users.add(user)
  
  serializer = ReviewDisLikeSerializer(review)
  return Response(serializer.data)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review_comment(request, review_id):
  review = get_object_or_404(Review, pk=review_id)
  if request.method == "GET":
    serializer = CommentListSerializer(review, context={'request': request})
    return Response(serializer.data)
  elif request.method == "POST":
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      serializer.save(commented_review=review, comment_writor=request.user)
      serializer = CommentListSerializer(review, context={'request': request})
      return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def review_recomment(request, review_id, comment_id):
  review = get_object_or_404(Review, pk=review_id)
  comment = get_object_or_404(Comment, pk=comment_id)
  if request.method == "POST":
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      serializer.save(commented_review=review, comment_writor=request.user, super_comment=comment)
      serializer = CommentListSerializer(review, context={'request': request})
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  elif request.method == "PUT":
    if request.user == comment.comment_writor:
      serializer = CommentSerializer(comment, data=request.data)
      if serializer.is_valid(raise_exception=True):
        serializer.save()
        serializer = CommentListSerializer(review, context={'request': request})
        return Response(serializer.data)
    else:
      return Response({"message": "작성자 본인만 수정 및 삭제가 가능합니다"}, status=status.HTTP_401_UNAUTHORIZED)
  elif request.method == "DELETE":
    if request.user == comment.comment_writor:
      comment.delete()
      serializer = CommentListSerializer(review, context={'request': request})
      return Response(serializer.data, status=status.HTTP_200_OK)
    else:
      return Response({"message": "작성자 본인만 수정 및 삭제가 가능합니다"}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def comment_like(request, review_id, comment_id):
  review = get_object_or_404(Review, pk=review_id)
  comment = get_object_or_404(Comment, pk=comment_id)
  user = request.user
  if comment.like_comment_users.filter(pk=user.pk).exists():
    comment.like_comment_users.remove(user)
  else:
    comment.like_comment_users.add(user)
  serializer = CommentListSerializer(review, context={'request': request})
  return Response(serializer.data)