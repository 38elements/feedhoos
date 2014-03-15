# coding: utf-8
from django.http import HttpResponse
from feedhoos.folder.models.folder import FolderModel


def execute(request):
    folder_id = request.POST["id"]
    FolderModel.delete_and_change_bookmark(folder_id)
    response_json = json.dumps({"msg": "OK"}, ensure_ascii=False, skipkeys=True)
    return HttpResponse(response_json, mimetype='application/json')
