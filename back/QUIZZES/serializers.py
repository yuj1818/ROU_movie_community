import json
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()

class QuizItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = QuizItem
    fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
  class UserSerializer(serializers.ModelSerializer):
    class Meta:
      model = User
      fields = ('id', 'username')


  quiz_writor = UserSerializer(read_only=True)
  items = QuizItemSerializer(many=True)

  class Meta:
    model = Quiz
    fields = '__all__'

  def create(self, validated_data):
    request = self.context.get('request')
    items_data = request.data.get('items', '[]')

    quiz = Quiz.objects.create(**validated_data, quiz_writor=request.user)
    
    try:
      items_list = json.loads(items_data)
      for item in items_list:
        QuizItem.objects.create(quiz=quiz, **item)
    except json.JSONDecodeError:
      raise serializers.ValidationError({"items data": "Invalid JSON format"})
    
    return quiz