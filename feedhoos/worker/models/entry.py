# coding: utf-8
from django.db import models
import time
MAX_CONTENT_LENGTH = 8192
PER_PAGE = 200


class EntryModel(models.Model):
    feed_id = models.IntegerField()
    url = models.URLField(max_length=256)
    title = models.CharField(max_length=64)
    updated = models.IntegerField()
    content = models.TextField()

    @staticmethod
    def get_entries(feed_id, page, min_update=None):
        feed_id = int(feed_id)
        page = int(page)
        start_index = (page - 1) * PER_PAGE
        end_index = (page) * PER_PAGE
        try:
            query = EntryModel.objects.all().filter(
                feed_id=feed_id
            )
            if min_update:
                query = query.filter(
                    updated__gt=min_update
                )
            entries = query.order_by("-updated")[start_index:end_index]
        except EntryModel.DoesNotExist:
            entries = []
        return entries

    @staticmethod
    def get_content(entry):
        if (entry.content and
                len(entry.content) > 1 and len(entry.content[0]["value"]) < MAX_CONTENT_LENGTH):
            return entry.content[0]["value"]
        elif entry.summary:
            return entry.summary if len(entry.summary) < MAX_CONTENT_LENGTH else ""
        else:
            return ""

    @staticmethod
    def add(feed_id, entry):
        entry_model = EntryModel(
            feed_id=feed_id,
            url=entry.link,
            title=entry.title,
            updated=int(time.mktime(entry.updated_parsed)),
            content=EntryModel.get_content(entry)
        )
        entry_model.save()
        return entry_model

    class Meta:
        app_label = 'worker'
        index_together = (
            ("feed_id", "updated"),
        )
        unique_together = (
            ("url", "updated"),
        )
