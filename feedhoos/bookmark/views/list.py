# coding: utf-8
from django.http import HttpResponse
from feedhoos.reader.models.bookmark import BookmarkModel


def execute(request):
    "bookmarkデータの一覧を返す"
    bookmark_models = BookmarkModel.objects.all()
    bookmarks_json = BookmarkModel.get_json(bookmark_models)
    return HttpResponse(bookmarks_json, content_type='application/json')
