# coding: utf-8
from django.shortcuts import render
from feedfinder2 import find_feeds
import feedparser
from feedhoos.finder.forms.feed import FeedForm


def execute(request):
    feedform = FeedForm(request.POST)
    if feedform.is_valid():
        feed_urls = find_feeds(feedform.cleaned_data["url"])
    else:
        feeds = []
    return render(request, "finder/select.html", {"feed_urls": feed_urls})
