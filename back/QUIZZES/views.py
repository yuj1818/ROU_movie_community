from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import *
from .serializers import *

User = get_user_model()

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def index(request):
  if request.method == "GET":
    limit = request.GET.get("limit", 10)
    quizzes = Quiz.objects.all().order_by('?')[:10]
    return
  elif request.method == "POST":
    serializer = QuizSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
      quiz = serializer.save()
      return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)