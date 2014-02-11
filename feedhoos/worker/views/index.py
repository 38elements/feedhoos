# coding: utf-8
from django.shortcuts import redirect
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    map(lambda f: f.add_entries(), FeedModel.objects.all())
    return redirect("top")
