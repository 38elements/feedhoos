# coding: utf-8
import json
from django.db import models
from feedhoos.reader.models.bookmark import BookmarkModel
from feedhoos.reader.models.bookmark import DEFAULT_FOLDER_ID


class FolderModel(models.Model):
    title = models.CharField(max_length=32)
    rating = models.PositiveSmallIntegerField(default=0)

    @staticmethod
    def get_json(folder_models):
        dicts = map(lambda f: f.dict, folder_models)
        folder_json = json.dumps(
            dicts,
            ensure_ascii=False, skipkeys=True
        )
        return folder_json

    @staticmethod
    def delete_and_change_bookmark(folder_id):
        """フォルダーを消す 。ブックマークのフォルダーidをデフォルトidにする。"""
        folder_model = FolderModel.objects.get(pk=folder_id)
        folder_model.delete()
        BookmarkModel.objects.filter(folder_model=self.id).update(folder_id=DEFAULT_FOLDER_ID)

    @property
    def dict(self):
        d = {
            "id": self.id,
            "title": self.title,
            "rating": self.rating,
            "type": "folder"
        }
        return d

    class Meta:
        app_label = 'folder'
