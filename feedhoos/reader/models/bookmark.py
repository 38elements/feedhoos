# coding: utf-8
import json
from django.db import models


class BookmarkModel(models.Model):
    feed_id = models.IntegerField(unique=True)
    last_updated = models.IntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)

    @staticmethod
    def get_json(bookmark_models):
        bookmarks_dict = {}
        for b in bookmark_models:
            bookmarks_dict[str(b.feed_id)] = {"rating": b.rating}
        bookmark_json = json.dumps(
            bookmarks_dict,
            ensure_ascii=False, skipkeys=True
        )
        return bookmark_json

    class Meta:
        app_label = 'reader'
