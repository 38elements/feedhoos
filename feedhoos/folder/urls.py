# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.folder.views.create


urlpatterns = patterns(
    '',
    url(r'^create/$', feedhoos.folder.views.create.execute, name="create"),
)
