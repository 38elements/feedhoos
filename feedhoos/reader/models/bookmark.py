# coding: utf-8
import json
from django.db import models


class BookmarkModel(models.Model):
    feed_id = models.IntegerField(unique=True)
    last_updated = models.IntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)
    folder_id = models.IntegerField(default=0, db_index=True)

    @staticmethod
    def get_json(bookmark_models):
        bookmarks_dict = {
            "0": {
                "rating": 6,
                "type": "feed",
                "folder_id": 0
            }
        }
        for b in bookmark_models:
            bookmarks_dict[str(b.feed_id)] = {
                "folder_id": b.folder_id,
                "rating": b.rating,
                "type": "feed"
            }
        bookmark_json = json.dumps(
            bookmarks_dict,
            ensure_ascii=False, skipkeys=True
        )
        return bookmark_json

    class Meta:
        app_label = 'reader'
