# coding: utf-8
from django.db import models
import time
import datetime
MAX_CONTENT_LENGTH = 10240
PER_PAGE = 200


class EntryModel(models.Model):
    feed_id = models.IntegerField()
    url = models.URLField(max_length=256)
    title = models.CharField(max_length=64)
    updated = models.IntegerField()
    content = models.TextField()

    @property
    def dict(self):
        d = {
            "id": self.id,
            "url": self.url.encode("utf-8"),
            "feed_id": self.feed_id,
            "title": self.title.encode("utf-8"),
            "updated": self.updated_stftime,
            "content": self.content.encode("utf-8"),
        }
        return d

    @property
    def updated_stftime(self):
        datetime_obj = datetime.datetime.fromtimestamp(self.updated)
        return datetime_obj.strftime('%Y-%m-%d %H:%M')

    @staticmethod
    def count(feed_id, min_updated=0):
        feed_id = int(feed_id)
        count = EntryModel.objects.all().filter(
            feed_id=feed_id
        ).filter(
            updated__gt=min_updated
        ).order_by("-updated").count()
        count = count if count <= MAX_CONTENT_LENGTH else MAX_CONTENT_LENGTH
        return count

    @staticmethod
    def get_entries(feed_id, page, min_updated=None):
        feed_id = int(feed_id)
        page = int(page)
        start_index = (page - 1) * PER_PAGE
        end_index = (page) * PER_PAGE
        try:
            query = EntryModel.objects.all().filter(
                feed_id=feed_id
            )
            if min_updated:
                query = query.filter(
                    updated__gt=min_updated
                )
            entries = query.order_by("-updated")[start_index:end_index]
        except EntryModel.DoesNotExist:
            entries = []
        return entries

    @staticmethod
    def get_timeline(feed_id, page):
        feed_id = int(feed_id)
        page = int(page)
        start_index = (page - 1) * PER_PAGE
        end_index = (page) * PER_PAGE
        try:
            query = EntryModel.objects.all()
            if feed_id:
                query = query.filter(
                    feed_id=feed_id
                )
            entries = query.order_by("-updated")[start_index:end_index]
        except EntryModel.DoesNotExist:
            entries = []
        return entries

    @staticmethod
    def get_content(entry):
        if ("content" in entry and entry.content and
                len(entry.content) > 1 and len(entry.content[0]["value"]) < MAX_CONTENT_LENGTH):
            return entry.content[0]["value"]
        elif "summary" in entry and entry.summary:
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
            ("url", "updated", "feed_id"),
        )
