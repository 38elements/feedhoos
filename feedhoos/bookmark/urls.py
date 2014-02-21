# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.bookmark.views.list

urlpatterns = patterns(
    '',
    url(r'^list/', feedhoos.bookmark.views.list.execute, name="list"),
)
