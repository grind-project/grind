from typing import Any, ClassVar, List

from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()  # Retourne tous les documents
    serializer_class = DocumentSerializer
    permission_classes: ClassVar[List[type]] = [IsAuthenticated]  # Correction RUF012

    def get_queryset(self) -> QuerySet[Document]:
        return Document.objects.all().select_related("parent", "parent__parent")

    @action(detail=True)
    def structure(self, request: Any, pk: str | None = None) -> Response:
        """Retourne la structure du document (table des matières)"""
        document = self.get_object()
        return Response(
            {
                "id": document.id,
                "title": document.title,
                "children": [],  # Pour l'instant, on retourne une structure vide
            }
        )
