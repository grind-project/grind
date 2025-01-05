from typing import cast

from django.contrib import admin
from django.db.models import Case, IntegerField, QuerySet, Value, When
from django.http import HttpRequest
from django.utils.html import format_html

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("hierarchical_title", "document_type", "order", "created_at")
    list_filter = ("parent__parent__parent", "parent__parent", "parent")
    search_fields = ("title", "content")
    ordering = ("order",)

    def get_queryset(self, request: HttpRequest) -> QuerySet[Document]:
        """Trie les documents par niveau, matière, catégorie"""
        qs = super().get_queryset(request)
        return cast(
            QuerySet[Document],
            qs.annotate(
                level_type=Case(
                    When(parent__isnull=True, then=Value(0)),  # Grades
                    When(parent__parent__isnull=True, then=Value(1)),  # Subjects
                    default=Value(2),  # Categories
                    output_field=IntegerField(),
                )
            ).order_by(
                "level_type",  # D'abord par type (Grade/Subject/Category)
                "order",  # Puis par ordre dans chaque niveau
                "title",  # Puis par titre
            ),
        )

    def hierarchical_title(self, obj: Document) -> str:
        """Affiche la hiérarchie complète du document"""
        if not obj.parent:  # Grade
            return format_html('<strong style="color: #1a73e8;">{}</strong>', obj.title)
        elif not obj.parent.parent:  # Subject
            return format_html(
                '{} → <strong style="color: #188038;">{}</strong>',
                obj.parent.title,
                obj.title,
            )
        else:  # Category
            return format_html(
                '{} → {} → <strong style="color: #c5221f;">{}</strong>',
                obj.parent.parent.title,
                obj.parent.title,
                obj.title,
            )

    hierarchical_title.short_description = "Hiérarchie"  # type: ignore

    def document_type(self, obj: Document) -> str:
        types = {
            0: '<span style="color: #1a73e8;">Grade</span>',
            1: '<span style="color: #188038;">Subject</span>',
            2: '<span style="color: #c5221f;">Category</span>',
        }
        level = 0
        current = obj
        while current.parent:
            level += 1
            current = current.parent
        return format_html(types[level])

    document_type.short_description = "Type"  # type: ignore
