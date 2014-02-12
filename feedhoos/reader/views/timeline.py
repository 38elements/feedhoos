# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel


def execute(request, feed_id="0", page="1"):
    entries = EntryModel.get_timeline(feed_id, page)
    return render(request, "reader/feed.html", {"entries": entries})
