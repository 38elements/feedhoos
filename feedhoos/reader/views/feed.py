# coding: utf-8
from django.shortcuts import render
from feedhoos.worker.models.entry import EntryModel


def execute(request, id):
    entries = EntryModel.objects.all()
    return render(request, "reader/feed.html", {"entries": entries})
