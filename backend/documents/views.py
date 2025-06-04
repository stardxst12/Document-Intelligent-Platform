from django.shortcuts import render
from django.http import HttpResponse

def documents(request):
    return HttpResponse("Hello World!")
