from django.contrib import admin
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel


admin.site.register(EntryModel)
admin.site.register(FeedModel)
admin.site.register(BookmarkModel)
