from typing import ClassVar, List

from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields: ClassVar[List[str]] = ["id", "title", "content", "parent", "order"]
        depth: ClassVar[int] = 2  # Pour inclure les parents des parents
