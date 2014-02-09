# coding: utf-8
from django.shortcuts import render
import feedparser
from feedhoos.finder.forms.feed import FeedForm
from feedhoos.finder.models.feed import FeedModel
#from wsgiref.handlers import format_date_time
import datetime
import time


def execute(request):
    feedform = FeedForm(request.POST)
    feed = {}
    if feedform.is_valid():
        feed_url = feedform.cleaned_data["url"]
        try:
            feed_model = FeedModel.objects.get(url=feed_url)
        except FeedModel.DoesNotExist:
            feed = feedparser.parse(feed_url, etag=None, modified=None)
            feed_model = FeedModel(
                url=feed_url,
                last_access=int(time.mktime(datetime.datetime.now().timetuple())),
                etag=feed.etag if "etag" in feed else "",
                modified=feed.modified if "modified" in feed else ""
            )
            feed_model.feed = feed
            feed_model.save()
        else:
            feed["msg"] = "exist"
    else:
        feed["msg"] = "validation_error"
    return render(request, "finder/registered.html", {"feed": feed})
