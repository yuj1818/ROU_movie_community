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
    fields = ('super_review',)

# 상위 댓글 조회
class SuperCommentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Comment
    fields = ('super_comment',)

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username',)

class CommentSerializer(serializers.ModelSerializer):
  comment_writor = UserSerializer(read_only=True)
  super_comment = SuperCommentSerializer(read_only=True)

  class Meta:
    model = Comment
    # 댓글 번호, 댓글 작성자 번호, 이름, 댓글 내용, 댓글이 작성된 리뷰글 번호, 상위 댓글 번호
    fields = ('pk', 'comment_writor', 'content', 'commented_review', 'super_comment',)
    read_only_fields = ('commented_review', )

# 대댓글까지 조회하기 위한 중간 Serializer
class NewSuperCommentSerializer(serializers.ModelSerializer):
  commented = serializers.SerializerMethodField()
  comment_writor = UserSerializer(read_only=True)

  class Meta:
    model = Comment
    # 댓글 번호, 댓글 작성자 번호, 댓글의 좋아요 수, 상위 댓글 번호, 댓글 내용, 작성 시간, 대댓글 정보(댓글 정보와 동일)
    fields = ('id', 'comment_writor', 'like_comment_users',  'commented_review',
              'super_comment', 'content', 'created_at', 'commented', 'updated_at',)

  # 댓글 번호, 댓글 작성자,
  def get_commented(self, instance):
    serializer = self.__class__(instance.commented, many=True)
    serializer.bind('', self)
    return serializer.data

# 댓글 조회(대댓글 포함)
class ReivewOnlySerializer(serializers.ModelSerializer):
  reply_comments = serializers.SerializerMethodField()

  class Meta:
    model = Review
    # 게시글 번호, 댓글 정보 목록
    fields = ('id', 'reply_comments', )

  def get_reply_comments(self, obj):
    reply_comments = obj.review_comment.filter(super_comment=None)
    serializer = NewSuperCommentSerializer(reply_comments, many=True)
    return serializer.data


# 댓글별 좋아요 수 출력
class CommentLikeSerializer(serializers.ModelSerializer):
  like_comment_users_count = serializers.IntegerField()

  class Meta:
    model = Comment
    # 댓글 id, 댓글의 좋아요 개수, 댓글 내용
    fields = ('id', 'like_comment_users_count', 'content')

class MovieSerializer(serializers.ModelSerializer):
  class Meta:
    model = Movie
    fields = ('movie_id', 'title',)

# 전체 게시글 목록 조회 및 영화를 선택하지 않은 게시글 생성
class ReviewListSerializer(serializers.ModelSerializer):
  review_movie = MovieSerializer(read_only=True)  # 게시글이 달린 영화
  review_writor = UserSerializer(read_only=True)  # 게시글 작성자
  comment_count = serializers.IntegerField()  # 댓글 수
  like_count = serializers.IntegerField()  # 좋아요 수
  dislike_count = serializers.IntegerField()  # 싫어요 수

  class Meta:
    model = Review
    # 전체 게시글 출력 필드
    # id, 제목, 생성 시간, 좋아요 수, 댓글 수, 작성자, 리뷰한 영화 제목
    fields = ('id', 'title', 'content', 'created_at', 'updated_at', 'like_count', 'dislike_count',
              'comment_count', 'review_writor', 'review_movie')


# 단일 게시글 조회, 수정, 삭제
class ReviewSerializer(serializers.ModelSerializer):
  review_movie = MovieSerializer(read_only=True)  # 게시글이 달린 영화
  review_writor = UserSerializer(read_only=True)  # 게시글 작성자
  like_count = serializers.IntegerField(read_only=True)  # 좋아요 수
  dislike_count = serializers.IntegerField(read_only=True)
  comment_count = serializers.IntegerField(read_only=True)  # 댓글 수

  class Meta:
    model = Review
    # 전체 게시글 출력 필드
    # 게시글 id, 작성자, 제목, 내용, 생성 시간, 좋아요 수, 댓글 수, 게시글이 달린 영화
    fields = ('id', 'review_writor', 'title', 'content', 'updated_at',
              'created_at', 'like_count', 'comment_count', 'review_movie', 'dislike_count',)


# 게시글 좋아요 등록 및 해제
class ReviewLikeSerializer(serializers.ModelSerializer):
  like_review_users = UserSerializer(many=True, read_only=True)  # 좋아요한 작성자

  class Meta:
    model = Review
    # 게시글 id, 좋아요한 사용자 목록
    fields = ('id', 'like_review_users')


# 게시글 싫어요 등록 및 해제
class ReviewDisLikeSerializer(serializers.ModelSerializer):
  dislike_review_users = UserSerializer(many=True, read_only=True)  # 싫어요한 작성자

  class Meta:
    model = Review
    # 게시글 id, 싫어요한 사용자 목록
    fields = ('id', 'dislike_review_users')