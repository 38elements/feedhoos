# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel


def execute(request, feed_id, page="1"):
    feed_model = FeedModel.objects.get(pk=feed_id)
    bookmark_model = BookmarkModel.objects.get(feed_id=feed_id)
    entries = EntryModel.get_entries(feed_id, page, bookmark_model.last_updated)
    if entries:
        last_updated = feed_model.last_updated
        bookmark_model.last_updated = last_updated
        bookmark_model.save()
    return render(request, "reader/feed.html", {"entries": entries, "feed": feed_model})
