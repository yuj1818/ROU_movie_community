from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from .serializers import *
from MOVIES.models import Genre
from django.http import JsonResponse
from django.db.models import Count, Q, F, ExpressionWrapper, IntegerField
from django.db.models.functions import ExtractYear
from django.utils.timezone import now
import requests
from django.conf import settings
from rest_framework.authtoken.models import Token
from allauth.socialaccount.models import SocialAccount
from django.core.files.base import ContentFile
from rest_framework.pagination import PageNumberPagination

User = get_user_model()


class MoviePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100


class RelationPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = "page_size"
    max_page_size = 100


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete(request):
    request.user.delete()
    return Response(
        {"message": f"사용자 {request.user} 탈퇴 완료!"},
        status=status.HTTP_204_NO_CONTENT,
    )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request, user_pk):
    user = get_object_or_404(User, pk=user_pk)
    if request.method == "GET":
        serializer = ProfileSerializer(user, context={"request": request})
        if request.user.pk != user_pk:
            data = {"isFollowing": user.followers.filter(pk=request.user.pk).exists()}
            data.update(serializer.data)
            return Response(data)
        return Response(serializer.data)
    elif request.method == "PUT":
        if request.user == user:
            serializer = ProfileSerializer(
                instance=user,
                data=request.data,
                partial=True,
                context={"request": request},
            )
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def preference(request, pType):
    user = get_object_or_404(User, pk=request.user.pk)
    if request.method == "GET":
        if pType == "like":
            serializer = LikeGenreSerializer(user)
        elif pType == "hate":
            serializer = HateGenreSerializer(user)
        return Response(serializer.data)
    elif request.method == "PUT":
        genres = request.data["genres"].split(",") if request.data["genres"] else []
        if pType == "like":
            user.like_genres.clear()
            for genre_name in genres:
                genre = get_object_or_404(Genre, name=genre_name)
                user.like_genres.add(genre)
            serializer = LikeGenreSerializer(user)
        elif pType == "hate":
            user.hate_genres.clear()
            for genre_name in genres:
                genre = get_object_or_404(Genre, name=genre_name)
                user.hate_genres.add(genre)
            serializer = HateGenreSerializer(user)
        return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow(request, user_pk):
    user = get_object_or_404(User, pk=user_pk)
    if request.method == 'POST':
        if request.user != user:
            if user.followers.filter(pk=request.user.pk).exists():
                user.followers.remove(request.user)
            else:
                user.followers.add(request.user)
            serializer = ProfileSerializer(user, context={"request": request})
            data = {"isFollowing": user.followers.filter(pk=request.user.pk).exists()}
            data.update(serializer.data)
            return Response(data)
        else:
            return Response(
                {"detail": "본인은 팔로우 불가"}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def relations(request, user_pk):
    relation_type = request.query_params.get("type")

    if relation_type not in ["followers", "followings", "friends"]:
        return Response(
            {"error": "Invalid target parameter"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = get_object_or_404(
        User.objects.prefetch_related("followers", "followings"), pk=user_pk
    )

    if relation_type == "followers":
        queryset = user.followers.all()
    elif relation_type == "followings":
        queryset = user.followings.all()
    elif relation_type == "friends":
        queryset = user.friends_queryset

    queryset = queryset.order_by("nickname")
    paginator = RelationPagination()
    page = paginator.paginate_queryset(queryset, request)

    serializer = UserSerializer(page, many=True, context={"request": request})

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def movie_list(request, user_pk):
    target = request.query_params.get("target")

    if target not in ["like", "review", "favorite", "watch"]:
        return Response(
            {"error": "Invalid target parameter"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = get_object_or_404(User, pk=user_pk)

    if target == "like":
        queryset = user.like_movies.all()
    elif target == "review":
        queryset = Movie.objects.filter(movie_review__review_writor=user).distinct()
    elif target == "favorite":
        queryset = user.favorite_movies.all()
    elif target == "watch":
        queryset = user.watching_movies.all()

    queryset = queryset.order_by("-release_date")
    paginator = MoviePagination()
    page = paginator.paginate_queryset(queryset, request)

    serializer = MovieListSerializer(page, many=True, context={"request": request})

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_friend(request):
    user = request.user
    if not user.is_authenticated:
        return Response(
            {"error": "로그인이 필요합니다."}, status=status.HTTP_401_UNAUTHORIZED
        )

    base_queryset = User.objects.exclude(pk=user.pk).exclude(is_staff=True)

    # 1차 추천 (사용자와 좋아하는 장르가 50% 이상 겹치는 유저들을 조회)
    user_like_genres = user.like_genres.all()
    min_common_genres = max(1, user_like_genres.count() // 2)

    primary_qs = (
        base_queryset.annotate(
            common_genres=Count(
                "like_genres", filter=Q(like_genres__in=user_like_genres), distinct=True
            )
        )
        .filter(common_genres__gte=min_common_genres)
        .order_by("-common_genres")[:5]
    )

    primary_ids = primary_qs.values_list("pk", flat=True)

    current_year = now().year

    # 2차 추천 (같은 지역의 비슷한 나이인 사람 추천)
    secondary_qs = (
        base_queryset.exclude(pk__in=primary_ids)
        .filter(region=user.region)
        .annotate(
            age=ExpressionWrapper(
                current_year - ExtractYear("birth"), output_field=IntegerField()
            ),
            age_diff=ExpressionWrapper(
                abs(
                    current_year
                    - ExtractYear("birth")
                    - (current_year - user.birth.year)
                ),
                output_field=IntegerField(),
            ),
        )
        .order_by("age_diff")[:5]
    )

    final_qs = list(primary_qs) + list(secondary_qs)

    serializer = UserSerializer(final_qs, many=True, context={"request": request})

    if final_qs:
        return Response(serializer.data)
    else:
        return Response(
            {"message": "추천 친구가 없습니다"}, status=status.HTTP_204_NO_CONTENT
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    id_token = request.data.get("id_token")
    info_res = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": id_token},
    )
    info_res_status = info_res.status_code
    if info_res_status != 200:
        return Response(
            {"err_msg": "failed to get email"}, status=status.HTTP_400_BAD_REQUEST
        )
    info_res_json = info_res.json()
    email = info_res_json.get("email")
    uid = info_res_json.get("sub")

    try:
        user = User.objects.get(email=email)
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        return Response(
            {
                "is_new": False,
                "key": token.key,
                "user": user.id,
            },
            status=status.HTTP_200_OK,
        )
    except Exception:
        return Response(
            {
                "message": "추가 정보 입력이 필요합니다.",
                "is_new": True,
                "email": email,
                "uid": uid,
            },
            status=status.HTTP_202_ACCEPTED,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def kakao_login(request):
    access_token = request.data.get("access_token")
    if not access_token:
        return Response(
            {"err_msg": "access_token missing"}, status=status.HTTP_400_BAD_REQUEST
        )
    info_res = requests.get(
        "https://kapi.kakao.com/v1/oidc/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    if info_res.status_code != 200:
        return Response(
            {"err_msg": "failed to get userinfo"}, status=status.HTTP_400_BAD_REQUEST
        )
    info_res_json = info_res.json()
    email = info_res_json.get("email")
    uid = info_res_json.get("sub")
    profile_image = None
    if info_res_json.get("picture"):
        profile_res = requests.get(info_res_json["picture"])
        profile_image = ContentFile(profile_res.content)

    try:
        user = User.objects.get(email=email)
        if profile_image:
            user.profile_image.save(f"profile_{user.id}", profile_image)
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        serializer = TokenSerializer(token)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception:
        data = {
            "email": email,
            "nickname": info_res_json.get("nickname"),
            "birth": info_res_json.get("birthdate"),
            "region": "서울특별시 강남구",
            "username": email,
            "password1": "임시비밀번호입니다",
            "password2": "임시비밀번호입니다",
        }
        serializer = CustomRegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save(request=request)
            if profile_image:
                user.profile_image.save(f"profile_{user.id}", profile_image)
            user.save()
            SocialAccount.objects.create(user=user, uid=uid, provider="kakao")
            token = Token.objects.get(user=user)
            seializer = TokenSerializer(token)
            return Response(seializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def social_add_info(request):
    if request.method == "POST":
        serializer = CustomRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(request=request)
            SocialAccount.objects.create(
                user=user, provider="google", uid=request.data.get("uid")
            )
            token = Token.objects.get(user=user)
            serializer = TokenSerializer(token)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
