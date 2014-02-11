# coding: utf-8
from django.shortcuts import render
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    all_feeds = FeedModel.objects.all()
    feeds = filter(lambda f: f.unread_count > 0, all_feeds)
    return render(request, "index.html", {"feeds": feeds})
