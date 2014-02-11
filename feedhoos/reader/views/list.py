# coding: utf-8
from django.shortcuts import render
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    feeds = FeedModel.objects.all()
    return render(request, "reader/list.html", {"feeds": feeds})
