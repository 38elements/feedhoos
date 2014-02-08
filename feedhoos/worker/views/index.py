# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    print FeedModel.objects.all()
    return render(request, "index.html", {})
