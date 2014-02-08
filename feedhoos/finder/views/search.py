# coding: utf-8
from django.shortcuts import render
from feedhoos.finder.forms.feed import FeedForm


def execute(request):
    feedform = FeedForm()
    return render(request, "finder/search.html", {"feedform": feedform})
