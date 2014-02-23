# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.finder.models.feed import FeedModel


def execute(request):
    """ 未読のエントリーがあるFeedを未読エントリー数と共に返す。 """
    all_feeds = FeedModel.objects.all()
    feeds = filter(lambda f: f.unread_count > 0, all_feeds)
    feed_dicts = []
    for f in feeds:
        fd = f.reading_dict
        feed_dicts.append(fd)
    feeds_json = json.dumps(feed_dicts, ensure_ascii=False, skipkeys=True)
    return HttpResponse(feeds_json, mimetype='application/json')
