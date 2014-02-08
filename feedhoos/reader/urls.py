# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.reader.views.index

urlpatterns = patterns(
    '',
    url(r'^index/', feedhoos.reader.views.index.execute, name="index"),
)
