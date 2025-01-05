from typing import Any

from django.core.management.base import BaseCommand

from myapp.models import Document
from myapp.services.document_structure import create_grade_structure


class Command(BaseCommand):
    help = "Creates the initial document structure for grades, subjects, and categories"

    def handle(self, *args: Any, **options: Any) -> None:
        # Supprimer tous les documents existants
        Document.objects.all().delete()
        # Créer la nouvelle structure
        create_grade_structure()
        self.stdout.write(self.style.SUCCESS("Successfully created document structure"))
