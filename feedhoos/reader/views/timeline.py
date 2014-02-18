# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel


def execute(request, feed_id="0", page="1"):
    feed_id = int(feed_id)
    feed_dict = {"feed_id": feed_id, "title": "登録されているすべてのFeed"}
    if feed_id:
        # FIXME 該当するレコードがない時の処理
        feed_model = FeedModel.objects.get(pk=feed_id)
        feed_dict = feed_model.dict
    entry_models = EntryModel.get_timeline(feed_id, page)
    entry_dicts = map(lambda e: e.dict, entry_models)
    timeline_json = json.dumps(
        {"entries": entry_dicts, "feed": feed_dict},
        ensure_ascii=False, skipkeys=True
    )
    return HttpResponse(timeline_json, mimetype='application/json')
