# coding: utf-8
import json
from django.http import HttpResponse
import feedparser
from feedhoos.finder.forms.feed import FeedForm
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel
import datetime
import time


def execute(request):
    feedform = FeedForm(request.POST)
    result = {}
    if feedform.is_valid():
        feed_url = feedform.cleaned_data["url"]
        try:
            feed_model = FeedModel.objects.get(url=feed_url)
        except FeedModel.DoesNotExist:
            feed = feedparser.parse(feed_url, etag=None, modified=None)
            if feed.status in [200, 301, 302]:
                feed_model = FeedModel(
                    url=feed_url,
                    link=feed.feed.link,
                    title=feed.feed.title,
                    last_access=int(time.mktime(datetime.datetime.now().timetuple())),
                    etag=feed.etag if "etag" in feed else "",
                    modified=feed.modified if "modified" in feed else ""
                )
                feed_model.feed = feed
                feed_model.save()
                #feed_modelのidが必要
                feed_model.add_entries()
                # FIXME for personal
                if not BookmarkModel.objects.filter(feed_id=feed_model.id).exists():
                    BookmarkModel(feed_id=feed_model.id).save()
                result["msg"] = "ok"
                result["feed"] = feed_model.dict
                result["reading"] = feed_model.reading_dict
                #Bookmarkはクライアントで生成
            else:
                result["msg"] = "status error"
        else:
            result["msg"] = "exist"
    else:
        result["msg"] = "validation_error"
    result_json = json.dumps(result, ensure_ascii=False, skipkeys=True)
    return HttpResponse(result_json, mimetype='application/json')
