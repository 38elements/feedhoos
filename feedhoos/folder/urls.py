# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.folder.views.create
import feedhoos.folder.views.list


urlpatterns = patterns(
    '',
    url(r'^create/$', feedhoos.folder.views.create.execute, name="create"),
    url(r'^list/$', feedhoos.folder.views.list.execute, name="list"),
)
