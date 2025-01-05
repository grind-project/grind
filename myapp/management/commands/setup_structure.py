from typing import Any

from django.core.management.base import BaseCommand

from myapp.services.document_structure import create_grade_structure


class Command(BaseCommand):
    help = "Creates the initial document structure for grades, subjects, and categories"

    def handle(self, *args: Any, **options: Any) -> None:
        create_grade_structure()
        self.stdout.write(self.style.SUCCESS("Successfully created document structure"))
