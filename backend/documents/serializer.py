from rest_framework import serializers
from .models import Document, DocumentChunk

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_type', 'size', 'page_count', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'status']

class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ['document', 'chunk_index', 'chunk_text', 'page_number', 'embedding_id']