# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel


def execute(request, feed_id, page="1"):
    "未読のFeedを読む。bookmarkを更新する。"
    #FIXME レコードがないときの処理を追加すること
    feed_model = FeedModel.objects.get(pk=feed_id)
    feed_dict = feed_model.dict
    bookmark_model = BookmarkModel.objects.get(feed_id=feed_id)
    entry_models = EntryModel.get_entries(feed_id, page, bookmark_model.last_updated)
    entry_dicts = map(lambda e: e.dict, entry_models)
    if entry_dicts:
        last_updated = feed_model.last_updated
        bookmark_model.last_updated = last_updated
        bookmark_model.save()
    feed_json = json.dumps(
        {"entries": entry_dicts, "feed": feed_dict},
        ensure_ascii=False, skipkeys=True
    )
    return HttpResponse(feed_json, mimetype='application/json')
