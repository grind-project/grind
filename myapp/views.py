# Create your views here.
from rest_framework import viewsets

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()  # Retourne tous les documents
    serializer_class = DocumentSerializer
