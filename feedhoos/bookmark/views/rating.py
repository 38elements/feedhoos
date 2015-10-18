# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.reader.models.bookmark import BookmarkModel


def execute(request):
    "bookmarkのratingを変更する。"
    feed_id = request.POST["id"]
    rating = request.POST["rating"]
    bookmark_model = BookmarkModel.objects.get(feed_id=feed_id)
    bookmark_model.rating = int(rating)
    bookmark_model.save()
    response_json = json.dumps({"msg": "OK"}, ensure_ascii=False, skipkeys=True)
    return HttpResponse(response_json, content_type='application/json')
