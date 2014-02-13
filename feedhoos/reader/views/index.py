# coding: utf-8
from django.shortcuts import render
from feedhoos.finder.models.feed import FeedModel
from feedhoos.worker.models.entry import EntryModel


def execute(request):
    all_feeds = FeedModel.objects.all()
    feeds = filter(lambda f: f.unread_count > 0, all_feeds)
    entries = EntryModel.get_timeline(1, 1)
    return render(request, "index.html", {"feeds": feeds, "entries": entries})
