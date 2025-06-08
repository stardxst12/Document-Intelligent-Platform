from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, filters
from .models import Document, DocumentChunk
from .serializer import DocumentSerializer, DocumentChunkSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

import os
from PyPDF2 import PdfReader 
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile

#APIView
class DocumentList(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, format=None):
        documents = Document.objects.all().order_by('-created_at')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({'error': 'No files found'}, status=status.HTTP_400_BAD_REQUEST)
        
        #metadata
        file_type = os.path.splitext(uploaded_file.name)[1].lower().strip('.')
        file_size = uploaded_file.size
        page_count = 0

        if file_type == 'pdf':
            try:
                if isinstance(uploaded_file, InMemoryUploadedFile):
                    reader = PdfReader(uploaded_file)
                else:
                    with open(uploaded_file.temporary_file_path(), 'rb') as f:
                        reader = PdfReader(f)
                page_count = len(reader.pages)
            except Exception as e:
                print("PDF read error;", e)

        data = {
            'title': request.data.get('title', uploaded_file.name),
            'file': uploaded_file,
            'file_type': file_type,
            'size': file_size,
            'page_count': page_count,
        }

        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentChunkList(APIView):
    def get(self, request, doc_id):
        chunk = DocumentChunk.objects.all().filter(document_id=doc_id)
        serializer = DocumentChunkSerializer(chunk, many=True)
        return Response(serializer.data)


#Viewset
'''
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class DocumentChunkViewSet(viewsets.ModelViewSet):
    queryset = DocumentChunk.objects.all()
    serializer_class = DocumentChunkSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['document__id']

def documents(request):
    return HttpResponse("Hello World!")
'''
