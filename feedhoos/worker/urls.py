# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.worker.views.index

urlpatterns = patterns(
    '',
    url(r'^index/', feedhoos.worker.views.index.execute, name="index"),
)
