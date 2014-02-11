# coding: utf-8
from django.shortcuts import render
import feedparser
from feedhoos.finder.forms.feed import FeedForm
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel
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
            if feed.status in [200, 302]:
                feed_model = FeedModel(
                    url=feed_url,
                    title=feed.feed.title,
                    last_access=int(time.mktime(datetime.datetime.now().timetuple())),
                    etag=feed.etag if "etag" in feed else "",
                    modified=feed.modified if "modified" in feed else ""
                )
                feed_model.feed = feed
                feed_model.save()
                #feed_modelのidが必要
                feed_model.add_entries()
                # FIXME for personal
                if not BookmarkModel.objects.filter(feed_id=feed_model.id).exists():
                    BookmarkModel(feed_id=feed_model.id).save()
        else:
            feed["msg"] = "exist"
    else:
        feed["msg"] = "validation_error"
    return render(request, "finder/registered.html", {"feed": feed})
