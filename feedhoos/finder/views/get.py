# coding: utf-8
import json
from django.http import HttpResponse
from feedfinder2 import find_feeds
from feedhoos.finder.forms.feed import FeedForm


def execute(request):
    feedform = FeedForm(request.POST)
    if feedform.is_valid():
        feed_urls = find_feeds(feedform.cleaned_data["url"])
    else:
        feed_urls = []
    feed_urls_json = json.dumps(feed_urls, ensure_ascii=False, skipkeys=True)
    return HttpResponse(feed_urls_json, content_type='application/json')
