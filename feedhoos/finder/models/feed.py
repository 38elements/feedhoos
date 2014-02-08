# coding: utf-8
from django.db import models


class FeedModel(models.Model):
    url = models.URLField(max_length=256, unique=True)
    etag = models.CharField(max_length=64)
    modified = models.CharField(max_length=64)
    last_access = models.DateTimeField()

    class Meta:
        app_label = 'finder'
