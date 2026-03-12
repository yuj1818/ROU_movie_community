from dataclasses import field
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from rest_framework import serializers
from MOVIES.models import Movie

User = get_user_model()


# 상위 게시글 조회
class SuperReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ("super_review",)


# 상위 댓글 조회
class SuperCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("super_comment",)


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(use_url=False)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "profile_image",
            "nickname",
        )


class CommentSerializer(serializers.ModelSerializer):
    comment_writor = UserSerializer(read_only=True)
    super_comment = SuperCommentSerializer(read_only=True)

    class Meta:
        model = Comment
        # 댓글 번호, 댓글 작성자 번호, 이름, 댓글 내용, 댓글이 작성된 리뷰글 번호, 상위 댓글 번호
        fields = (
            "pk",
            "comment_writor",
            "content",
            "commented_review",
            "super_comment",
        )
        read_only_fields = ("commented_review",)


# 대댓글까지 조회하기 위한 중간 Serializer
class NewSuperCommentSerializer(serializers.ModelSerializer):
    commented = serializers.SerializerMethodField()
    comment_writor = UserSerializer(read_only=True)
    isLike = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(
        source="like_comment_users.count", read_only=True
    )

    class Meta:
        model = Comment
        # 댓글 번호, 댓글 작성자 번호, 댓글의 좋아요 수, 상위 댓글 번호, 댓글 내용, 작성 시간, 대댓글 정보(댓글 정보와 동일)
        fields = (
            "id",
            "comment_writor",
            "content",
            "commented_review",
            "super_comment",
            "created_at",
            "updated_at",
            "commented",
            "isLike",
            "like_count",
        )

    # 댓글 번호, 댓글 작성자,
    def get_commented(self, instance):
        replies = instance.commented.all().order_by("created_at")
        serializer = NewSuperCommentSerializer(replies, many=True, context=self.context)
        return serializer.data

    def get_isLike(self, instance):
        user = self.context["request"].user
        return instance.like_comment_users.filter(id=user.id).exists()


class CommentLikeSerializer(serializers.ModelSerializer):
    isLike = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(
        source="like_comment_users.count", read_only=True
    )

    class Meta:
        model = Comment
        fields = ("id", "isLike", "like_count")

    def get_isLike(self, instance):
        user = self.context["request"].user
        return instance.like_comment_users.filter(id=user.id).exists()


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ("movie_id", "title", "poster_path")


# 단일 게시글 조회, 수정, 삭제
class ReviewSerializer(serializers.ModelSerializer):
    review_movie = MovieSerializer(read_only=True)  # 게시글이 달린 영화
    review_writor = UserSerializer(read_only=True)  # 게시글 작성자
    like_count = serializers.IntegerField(
        source="like_review_users.count", read_only=True
    )  # 좋아요 수
    dislike_count = serializers.IntegerField(
        source="dislike_review_users.count", read_only=True
    )
    comment_count = serializers.SerializerMethodField()  # 댓글 수
    reaction = serializers.SerializerMethodField()

    class Meta:
        model = Review
        # 전체 게시글 출력 필드
        # 게시글 id, 작성자, 제목, 내용, 생성 시간, 좋아요 수, 댓글 수, 게시글이 달린 영화
        fields = (
            "id",
            "review_writor",
            "title",
            "content",
            "updated_at",
            "created_at",
            "like_count",
            "comment_count",
            "review_movie",
            "dislike_count",
            "reaction",
        )

    def get_comment_count(self, obj):
        return obj.review_comment.filter(super_comment__isnull=True).count()

    def get_reaction(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request, 'user'):
            return None

        user = request.user

        if not user.is_authenticated:
            return None

        if obj.like_review_users.filter(pk=user.pk).exists():
            return "LIKE"

        if obj.dislike_review_users.filter(pk=user.pk).exists():
            return "DISLIKE"

        return None


class ReviewReactionSerilaizer(serializers.ModelSerializer):
    like_count = serializers.IntegerField(
        source="like_review_users.count", read_only=True
    )
    dislike_count = serializers.IntegerField(
        source="dislike_review_users.count", read_only=True
    )
    reaction = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "reaction",
            "like_count",
            "dislike_count",
        )

    def get_reaction(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request, 'user'):
            return None

        user = request.user

        if not user.is_authenticated:
            return None

        if obj.like_review_users.filter(pk=user.pk).exists():
            return "LIKE"

        if obj.dislike_review_users.filter(pk=user.pk).exists():
            return "DISLIKE"

        return None
