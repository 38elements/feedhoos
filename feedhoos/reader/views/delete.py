# coding: utf-8
from django.shortcuts import redirect
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel
from django.db import transaction


@transaction.commit_on_success
def execute(request):
    feed_id = request.POST["feed_id"]
    feed_id = int(feed_id)
    FeedModel.objects.get(pk=feed_id).delete()
    BookmarkModel.objects.filter(feed_id__exact=feed_id).delete()
    EntryModel.objects.filter(
        feed_id__exact=feed_id
    ).delete()
    return redirect("reader:list_all")
