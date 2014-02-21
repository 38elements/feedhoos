# coding: utf-8
from django.db import models


class BookmarkModel(models.Model):
    feed_id = models.IntegerField(unique=True)
    last_updated = models.IntegerField(default=0)
    rating = models.PositiveSmallIntegerField(default=0)

    class Meta:
        app_label = 'reader'
