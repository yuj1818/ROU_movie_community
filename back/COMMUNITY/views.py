from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination


class ReviewPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review(request):
    if request.method == "GET":
        sort_key = request.GET.get("sort", 'recent')
        reviews = Review.objects.annotate(
            comment_count=Count("review_comment", distinct=True),
            like_count=Count("like_review_users", distinct=True),
        )
        # 최신 순
        if sort_key == 'recent':
            reviews = reviews.order_by("-pk", "-like_count", "-comment_count")
        # 좋아요 많은 순
        elif sort_key == 'likeDesc':
            reviews = reviews.order_by("-like_count", "-comment_count", "-pk")
        # 댓글 많은 순
        elif sort_key == 'commentDesc':
            reviews = reviews.order_by("-comment_count", "-like_count", "-pk")

        paginator = ReviewPagination()
        page = paginator.paginate_queryset(reviews, request)
        serializer = ReviewSerializer(page, many=True, context={"request": request})

        return paginator.get_paginated_response(serializer.data)
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
        isLike = review.like_review_users.filter(pk=request.user.pk).exists()
        isDislike = review.dislike_review_users.filter(pk=request.user.pk).exists()
        reaction = None
        if isLike:
            reaction = "LIKE"
        elif isDislike:
            reaction = "DISLIKE"

        data = {
            "reaction": reaction,
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
            return Response(
                {"message": "작성자 본인만 수정 및 삭제가 가능합니다"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
    elif request.method == "DELETE":
        if request.user == review.review_writor:
            review.delete()
            return Response(
                {"message": f"게시글 {review_id}번이 삭제되었습니다."},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"message": "작성자 본인만 수정 및 삭제가 가능합니다"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def review_reaction(request, review_id):
    review = get_object_or_404(Review, pk=review_id)
    user = request.user
    reaction_type = request.data.get("type")

    if reaction_type == 'LIKE':
        if review.like_review_users.filter(pk=user.pk).exists():
            review.like_review_users.remove(user)
        else:
            review.dislike_review_users.remove(user)
            review.like_review_users.add(user)
    elif reaction_type == 'DISLIKE':
        if review.dislike_review_users.filter(pk=user.pk).exists():
            review.dislike_review_users.remove(user)
        else:
            review.like_review_users.remove(user)
            review.dislike_review_users.add(user)

    serializer = ReviewReactionSerilaizer(review, context={"request": request})
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def review_comment(request, review_id):
    review = get_object_or_404(Review, pk=review_id)
    if request.method == "GET":
        serializer = CommentListSerializer(review, context={"request": request})
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(commented_review=review, comment_writor=request.user)
            serializer = CommentListSerializer(review, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def review_recomment(request, review_id, comment_id):
    review = get_object_or_404(Review, pk=review_id)
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(
                commented_review=review,
                comment_writor=request.user,
                super_comment=comment,
            )
            serializer = CommentListSerializer(review, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    elif request.method == "PUT":
        if request.user == comment.comment_writor:
            serializer = CommentSerializer(comment, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                serializer = CommentListSerializer(review, context={"request": request})
                return Response(serializer.data)
        else:
            return Response(
                {"message": "작성자 본인만 수정 및 삭제가 가능합니다"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
    elif request.method == "DELETE":
        if request.user == comment.comment_writor:
            comment.delete()
            serializer = CommentListSerializer(review, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "작성자 본인만 수정 및 삭제가 가능합니다"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


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
    serializer = CommentListSerializer(review, context={"request": request})
    return Response(serializer.data)
