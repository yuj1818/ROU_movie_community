from django.shortcuts import render
from .update_data import updateDB
from django.http import HttpResponse

# Create your views here.
def update_DB(request):
  try:
    updateDB(request)
    return HttpResponse("Database update completed successfully!")
  except Exception as e:
    return HttpResponse(f"Error Ocurred: {str(e)}", status=500)