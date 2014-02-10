# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.reader.views.index
import feedhoos.reader.views.feed

urlpatterns = patterns(
    '',
    url(r'^index/', feedhoos.reader.views.index.execute, name="index"),
    url(r'^feed/(?P<id>\d+)/', feedhoos.reader.views.feed.execute, name="feed"),
)
