from typing import ClassVar

from django.db import models


class Document(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="children"
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering: ClassVar[list[str]] = ["order"]

    def __str__(self) -> str:
        return self.title
