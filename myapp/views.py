# Create your views here.
from rest_framework import viewsets

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.filter(parent=None)  # Get only root documents
    serializer_class = DocumentSerializer
