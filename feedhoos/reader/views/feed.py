# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel


def execute(request, feed_id, page="1"):
    entries = EntryModel.objects.all().filter(feed_id=feed_id).order_by("-updated")[0:200]
    return render(request, "reader/feed.html", {"entries": entries})
