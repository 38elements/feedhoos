# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel
from django.db import transaction


@transaction.commit_on_success
def execute(request):
    feed_id = request.POST["id"]
    feed_id = int(feed_id)
    FeedModel.objects.get(pk=feed_id).delete()
    BookmarkModel.objects.filter(feed_id__exact=feed_id).delete()
    EntryModel.objects.filter(
        feed_id__exact=feed_id
    ).delete()
    response_json = json.dumps({"msg": "OK"}, ensure_ascii=False, skipkeys=True)
    return HttpResponse(response_json, mimetype='application/json')
