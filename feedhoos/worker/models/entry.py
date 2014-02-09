# coding: utf-8
from django.db import models
import time
MAX_CONTENT_LENGTH = 8192


class EntryModel(models.Model):
    feed_url = models.URLField(max_length=256)
    url = models.URLField(max_length=256)
    title = models.CharField(max_length=64)
    updated = models.IntegerField()
    content = models.TextField()

    @staticmethod
    def get_content(entry):
        if entry.content and len(entry.content) < MAX_CONTENT_LENGTH:
            return entry.content
        elif entry.summary:
            return entry.summary if len(entry.summary) < MAX_CONTENT_LENGTH else ""
        else:
            return ""

    @staticmethod
    def add(url, entry):
        entry_model = EntryModel(
            feed_url=url,
            url=entry.link,
            title=entry.title,
            updated=int(time.mktime(entry.updated_parsed)),
            content=EntryModel.get_content(entry)
        )
        entry_model.save()
        return entry_model

    class Meta:
        app_label = 'worker'
        unique_together = (
            ("feed_url", "updated"),
        )
