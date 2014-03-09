# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.bookmark.views.list
import feedhoos.bookmark.views.rating
import feedhoos.bookmark.views.folder

urlpatterns = patterns(
    '',
    url(r'^list/', feedhoos.bookmark.views.list.execute, name="list"),
    url(r'^rating/', feedhoos.bookmark.views.rating.execute, name="rating"),
    url(r'^folder/', feedhoos.bookmark.views.folder.execute, name="folder"),
)
