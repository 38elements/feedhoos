# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.reader.views.index
import feedhoos.reader.views.feed
import feedhoos.reader.views.list
import feedhoos.reader.views.delete

urlpatterns = patterns(
    '',
    url(r'^index/$', feedhoos.reader.views.index.execute, name="index"),
    url(r'^feed/(?P<feed_id>\d+)/page/$', feedhoos.reader.views.feed.execute, name="feed"),
    url(r'^feed/(?P<feed_id>\d+)/page/(?P<page>\d+)/$',
        feedhoos.reader.views.feed.execute, name="feed_var"),
    url(r'^feed/list/$', feedhoos.reader.views.list.execute, name="list"),
    url(r'^feed/list/delete/(?P<feed_id>\d+)/$',
        feedhoos.reader.views.delete.execute, name="delete"),
)
