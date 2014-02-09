from django.contrib import admin
from feedhoos.worker.models.entry import EntryModel
from feedhoos.finder.models.feed import FeedModel


admin.site.register(EntryModel)
admin.site.register(FeedModel)
