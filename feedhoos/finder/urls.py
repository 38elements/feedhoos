# coding: utf-8
from django.conf.urls import patterns, url
import feedhoos.finder.views.get
import feedhoos.finder.views.registered
import feedhoos.finder.views.search

urlpatterns = patterns(
    '',
    url(r'^get/', feedhoos.finder.views.get.execute, name="get"),
    url(r'^registered/', feedhoos.finder.views.registered.execute, name="registered"),
    url(r'^search/', feedhoos.finder.views.search.execute, name="search"),
)
