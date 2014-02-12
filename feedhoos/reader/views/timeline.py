# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel


def execute(request, feed_id="0", page="1"):
    feed_id = int(feed_id)
    feed_model = {"feed_id": feed_id, "title": "登録されているすべてのFeed"}
    if feed_id:
        feed_model = FeedModel.objects.get(pk=feed_id)
    entries = EntryModel.get_timeline(feed_id, page)
    return render(request, "reader/timeline.html", {"entries": entries, "feed": feed_model})
