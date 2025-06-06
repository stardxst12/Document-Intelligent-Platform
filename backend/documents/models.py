from django.db import models

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=10)
    size = models.IntegerField()
    page_count = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default='uploaded')
    created_at = models.DateTimeField(auto_now_add=True)

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    chunk_index = models.IntegerField()
    chunk_text = models.TextField()
    page_number = models.IntegerField(default=0)
    embedding_id = models.CharField(max_length=255)