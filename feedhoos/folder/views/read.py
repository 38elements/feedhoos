# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.worker.models.entry import EntryModel
from feedhoos.reader.models.bookmark import BookmarkModel
from feedhoos.folder.models.folder import FolderModel


def execute(request, folder_id, page):
    folder_id = int(folder_id)
    folder_model = FolderModel.objects.get(pk=folder_id)
    folder_dict = folder_model.dict
    bookmark_models = BookmarkModel.objects.filter(folder_id__exact=folder_id)
    try:
        feed_ids = map(lambda b: b.feed_id, bookmark_models)
        entry_models = EntryModel.get_folder(feed_ids, page)
    except EntryModel.DoesNotExist:
        entry_dicts = []
    else:
        entry_dicts = map(lambda e: e.dict, entry_models)
    folder_json = json.dumps(
        {"entries": entry_dicts, "feed": folder_dict},
        ensure_ascii=False, skipkeys=True
    )
    return HttpResponse(folder_json, content_type='application/json')
