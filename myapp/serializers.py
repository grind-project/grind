from typing import Any, ClassVar

from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields: ClassVar[list[str]] = [
            "id",
            "title",
            "content",
            "parent",
            "order",
            "children",
            "created_at",
            "updated_at",
        ]

    def get_children(self, obj: Document) -> Any:
        children = Document.objects.filter(parent=obj)
        return DocumentSerializer(children, many=True).data
