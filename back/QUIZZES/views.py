from django.shortcuts import get_object_or_404
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
    limit = int(request.GET.get("limit", 10))
    quizzes = Quiz.objects.all().order_by('?')[:limit]
    serializer = QuizListSerializer(quizzes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  elif request.method == "POST":
    serializer = QuizSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
      quiz = serializer.save()
      return Response(QuizSerializer(quiz, context={"request": request}).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def detail(request, quiz_id):
  quiz = get_object_or_404(Quiz, pk=quiz_id)
  if request.method == "GET":
    serializer = QuizSerializer(quiz)
    return Response(serializer.data)
  elif request.method == "POST":
    user_answer_id = request.data.get('answer')
    
    try:
      user_answer = QuizItem.objects.get(quiz=quiz, pk=user_answer_id)
      is_correct = user_answer.is_correct
    except QuizItem.DoesNotExist:
      return Response({'error': 'Invalid answer ID'}, status=status.HTTP_400_BAD_REQUEST)
    
    correct_answer = QuizItem.objects.filter(quiz=quiz, is_correct=True).first()
    
    return Response({
      'is_correct': is_correct,
      'correct_answer': correct_answer.choice_text
    })