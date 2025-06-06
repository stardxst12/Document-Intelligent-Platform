from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, filters
from .models import Document, DocumentChunk
from .serializer import DocumentSerializer, DocumentChunkSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class DocumentChunkViewSet(viewsets.ModelViewSet):
    queryset = DocumentChunk.objects.all()
    serializer_class = DocumentChunkSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['document__id']

#def documents(request):
    #return HttpResponse("Hello World!")
