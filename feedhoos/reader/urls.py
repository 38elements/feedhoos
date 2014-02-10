# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.reader.views.index
import feedhoos.reader.views.feed

urlpatterns = patterns(
    '',
    url(r'^index/$', feedhoos.reader.views.index.execute, name="index"),
    url(r'^feed/(?P<feed_id>\d+)/page/$', feedhoos.reader.views.feed.execute),
    url(r'^feed/(?P<feed_id>\d+)/page(?P<page>\d+)/$',
        feedhoos.reader.views.feed.execute, name="feed"),
)
