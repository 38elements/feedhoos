# coding: utf-8
from django.db import models


class FolderModel(models.Model):
    name = models.CharField(max_length=32)
    rating = models.PositiveSmallIntegerField(default=0)

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
