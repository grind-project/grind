from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand

from myapp.models import Document


class Command(BaseCommand):
    help = "Import content from markdown files"

    def handle(self, *args: Any, **options: Any) -> None:
        content_dir = Path("content")

        for grade_dir in content_dir.iterdir():
            if grade_dir.is_dir():
                grade_name = grade_dir.name.capitalize()
                try:
                    grade_doc = Document.objects.get(title=grade_name, parent=None)

                    for subject_dir in grade_dir.iterdir():
                        if subject_dir.is_dir():
                            subject_name = subject_dir.name.capitalize()
                            try:
                                subject_doc = Document.objects.get(
                                    title=subject_name, parent=grade_doc
                                )

                                for content_file in subject_dir.glob("*.md"):
                                    category = content_file.stem.capitalize()
                                    content = content_file.read_text(encoding="utf-8")

                                    try:
                                        doc = Document.objects.get(
                                            title=category, parent=subject_doc
                                        )
                                        doc.content = content
                                        doc.save()
                                        self.stdout.write(
                                            self.style.SUCCESS(
                                                f"Updated content: {grade_name}/{subject_name}/{category}"
                                            )
                                        )
                                    except Document.DoesNotExist:
                                        self.stdout.write(
                                            self.style.ERROR(
                                                f"Category not found: {category}"
                                            )
                                        )
                            except Document.DoesNotExist:
                                self.stdout.write(
                                    self.style.ERROR(
                                        f"Subject not found: {subject_name}"
                                    )
                                )
                except Document.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f"Grade not found: {grade_name}")
                    )
