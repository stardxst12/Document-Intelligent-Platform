from django.urls import path, include
from rest_framework.routers import DefaultRouter
#from .views import DocumentViewSet, DocumentChunkViewSet
from .views import DocumentList, DocumentChunkList, RAGQueryView

#APIView
urlpatterns = [
    path('documents/', DocumentList.as_view(), name='document-list'),
    path('documents/<int:doc_id>/chunks/', DocumentChunkList.as_view(), name='document-chunk'),
    path('rag/', RAGQueryView.as_view(), name='RAG query')
]



#viewset
'''router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'documentchunks', DocumentChunkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]'''