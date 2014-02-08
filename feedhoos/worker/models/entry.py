# coding: utf-8
from django.db import models
MAX_CONTENT_LENGTH = 5120


class EntryModel(models.Model):
    feed = models.URLField(max_length=256)
    url = models.URLField(max_length=256)
    title = models.CharField(max_length=64)
    updated = models.DateTimeField()
    content = models.TextField()

    @staticmethod
    def get_content(entry):
        if entry.summary:
            return entry.summary if len(entry.summary) < MAX_CONTENT_LENGTH else ""
        elif entry.content:
            return entry.content if len(entry.content) < MAX_CONTENT_LENGTH else ""
        else:
            return ""

    class Meta:
        app_label = 'worker'
        index_together = [
            ["feed", "updated"],
        ]
