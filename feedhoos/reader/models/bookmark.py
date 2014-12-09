# coding: utf-8
import json
from django.db import models
DEFAULT_FOLDER_ID = 0


class BookmarkModel(models.Model):
    """ しおり """
    feed_id = models.IntegerField(unique=True)
    # このフィードを表示したときのFeedModelのlast_updated
    # last_updatedまで読んだを記録する
    last_updated = models.IntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)
    folder_id = models.IntegerField(default=DEFAULT_FOLDER_ID, db_index=True)

    @staticmethod
    def get_json(bookmark_models):
        bookmarks_dict = {
            "0": {
                "rating": 6,
                "folder_id": DEFAULT_FOLDER_ID
            }
        }
        for b in bookmark_models:
            bookmarks_dict[str(b.feed_id)] = {
                "folder_id": b.folder_id,
                "rating": b.rating,
            }
        bookmark_json = json.dumps(
            bookmarks_dict,
            ensure_ascii=False, skipkeys=True
        )
        return bookmark_json

    class Meta:
        app_label = 'reader'
