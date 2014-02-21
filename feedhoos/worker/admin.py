from django.contrib import admin
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel
from feedhoos.reader.models.bookmark import BookmarkModel


class EntryModelAdmin(admin.ModelAdmin):
    list_display = ('id', "feed_id", "updated", 'url', 'title')
admin.site.register(EntryModel, EntryModelAdmin)


class FeedModelAdmin(admin.ModelAdmin):
    list_display = ('id', "title", "etag", "modified", "url", "link", "last_access")
admin.site.register(FeedModel, FeedModelAdmin)


class BookmarkModelAdmin(admin.ModelAdmin):
    list_display = ('id', "feed_id", "last_updated", "rating")
admin.site.register(BookmarkModel, BookmarkModelAdmin)
