# coding: utf-8
import json
from django.http import HttpResponse
from feedhoos.folder.models.folder import FolderModel


def execute(request):
    folder_model = FolderModel(title=request.POST["title"])
    folder_model.save()
    folder_dict = folder_model.dict
    folder_json = json.dumps(folder_dict, ensure_ascii=False, skipkeys=True)
    return HttpResponse(folder_json, content_type='application/json')
