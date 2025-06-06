from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentChunkViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'documentchunks', DocumentChunkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]