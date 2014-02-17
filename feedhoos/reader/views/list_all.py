# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    feeds_queryset = FeedModel.objects.all()
    feeds = map(lambda f: f.json, feeds_queryset)
    feeds_json = json.dumps(feeds, ensure_ascii=False)
    return HttpResponse(feeds_json, mimetype='application/json')
