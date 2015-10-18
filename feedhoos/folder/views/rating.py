# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.folder.models.folder import FolderModel


def execute(request):
    "folderのratingを変更する。"
    folder_id = request.POST["id"]
    rating = request.POST["rating"]
    folder_model = FolderModel.objects.get(pk=folder_id)
    folder_model.rating = int(rating)
    folder_model.save()
    response_json = json.dumps({"msg": "OK"}, ensure_ascii=False, skipkeys=True)
    return HttpResponse(response_json, content_type='application/json')
