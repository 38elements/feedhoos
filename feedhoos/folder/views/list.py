# coding: utf-8
from django.http import HttpResponse
from feedhoos.folder.models.folder import FolderModel


def execute(request):
    "folderデータの一覧を返す"
    folder_models = FolderModel.objects.all()
    folder_json = FolderModel.get_json(folder_models)
    return HttpResponse(folder_json, mimetype='application/json')
