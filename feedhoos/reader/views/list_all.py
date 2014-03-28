# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    feed_dict = FeedModel.ALL  
    feeds_queryset = FeedModel.objects.all()
    feeds = map(lambda f: f.dict, feeds_queryset)
    feeds.insert(0, feed_dict)
    feeds_json = json.dumps(feeds, ensure_ascii=False, skipkeys=True)
    return HttpResponse(feeds_json, mimetype='application/json')
