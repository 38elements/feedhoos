# coding: utf-8
import json
from django.db import models


class FolderModel(models.Model):
    name = models.CharField(max_length=32)
    rating = models.PositiveSmallIntegerField(default=0)

    @staticmethod
    def get_json(folder_models):
        dicts = map(lambda f: f.dict, folder_models)
        folder_json = json.dumps(
            dicts,
            ensure_ascii=False, skipkeys=True
        )
        return folder_json

    @property
    def dict(self):
        d = {
            "id": self.id,
            "name": self.name,
            "rating": self.rating,
            "type": "folder"
        }
        return d

    class Meta:
        app_label = 'folder'
