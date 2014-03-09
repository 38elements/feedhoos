# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.reader.models.bookmark import BookmarkModel


def execute(request):
    "bookmarkのfolderを変更する"
    feed_id = int(request.POST["feed_id"])
    folder_id = int(request.POST["folder_id"])
    #FIXME don not exist
    bookmark_model = BookmarkModel.objects.get(feed_id=feed_id)
    bookmark_model.folder_id = folder_id
    bookmark_model.save()
    response_json = json.dumps({"msg": "OK"}, ensure_ascii=False, skipkeys=True)
    return HttpResponse(response_json, mimetype='application/json')
