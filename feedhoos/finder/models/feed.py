# coding: utf-8
from django.db import models
from feedhoos.worker.models.entry import EntryModel
from feedhoos.reader.models.bookmark import BookmarkModel
import feedparser
import datetime
import time


class FeedModel(models.Model):
    url = models.URLField(max_length=256, unique=True)
    link = models.URLField(max_length=256)
    etag = models.CharField(max_length=64)
    modified = models.CharField(max_length=64)
    title = models.CharField(max_length=64)
    last_access = models.IntegerField()
    stars = models.PositiveSmallIntegerField(default=0, db_index=True)
    ALL = {
        "url": "",
        "id": 0,
        "title": "すべてのFeed",
    }

    @property
    def dict(self):
        d = {
            "id": self.id,
            "url": self.url.encode("utf-8"),
            "link": self.link.encode("utf-8"),
            "title": self.title.encode("utf-8"),
            "stars": self.stars,
        }
        return d

    @property
    def unread_count(self):
        if not hasattr(self, "_unread_count"):
            bookmark_model = BookmarkModel.objects.get(feed_id__exact=self.id)
            self._unread_count = EntryModel.count(self.id, min_updated=bookmark_model.last_updated)
        return self._unread_count

    @property
    def feed(self):
        if not hasattr(self, "_feed"):
            self._feed = feedparser.parse(self.url, etag=self.etag, modified=self.modified)
            self.last_access = int(time.mktime(datetime.datetime.now().timetuple()))
            self.etag = self._feed.etag if "etag" in self._feed else ""
            self.modified = self._feed.modified if "modified" in self._feed else ""
            self.save()
        return self._feed

    @feed.setter
    def feed(self, feed):
        self._feed = feed

    #FIXME DBを引く回数を減らす
    @property
    def last_updated(self):
        #feed_modelのidが必要
        #Entryがない場合は0を返す
        if not hasattr(self, "_last_updated"):
            entry = EntryModel.objects.filter(
                feed_id__exact=self.id
            ).order_by("-updated").first()
            if entry:
                self._last_updated = entry.updated
            else:
                self._last_updated = 0
        return self._last_updated

    @property
    def entries(self):
        #ウェブからとってきたエントリー
        return self.feed.entries

    @property
    def new_entries(self):
        if self.last_updated:
            new_entries = []
            for entry in self.entries:
                updated = int(time.mktime(entry.updated_parsed))
                if updated > self.last_updated:
                    new_entries.append(entry)
            return new_entries
        else:
            return self.entries

    def add_entries(self):
        for entry in self.new_entries:
            EntryModel.add(self.id, entry)

    class Meta:
        app_label = 'finder'
