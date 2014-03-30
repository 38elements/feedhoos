# coding: utf-8
from django.test import TestCase
from feedhoos.worker.models.entry import EntryModel
from feedhoos.worker.models.entry import MAX_CONTENT_LENGTH 
from collections import namedtuple
import datetime
from feedparser import FeedParserDict


class EntryModelTestCase(TestCase):
    fixtures = [
        'feedhoos/fixtures/entry.json',
    ]

    def setUp(self):
        super(EntryModelTestCase, self).setUp()

    def tearDown(self):
        super(EntryModelTestCase, self).tearDown()

    def test_add(self):
        before_count = EntryModel.objects.all().count()
        feed_id = 1
        updated_parsed = datetime.date(2013, 11, 23).timetuple()
        entry = FeedParserDict({
            "link": "http://example.con/1",
            "title": "test1 title",
            "updated_parsed": updated_parsed,
            "content": [{"value": "content"}],
            "summary": "summary"
        })
        EntryModel.add(feed_id, entry)
        after_count = EntryModel.objects.all().count()
        self.assertEqual(before_count + 1, after_count)

    def test_dict(self):
        entry_model = EntryModel.objects.get(pk=1)
        result = {
            'id': 1,
            'updated': '2014-02-21 00:03',
            'title': 'title1',
            'url': 'http://example.com/110001',
            'content': 'content1',
            'feed_id': 1
        }
        self.assertEqual(result, entry_model.dict)

    def test_updated_stftime(self):
        entry_model = EntryModel.objects.get(pk=1)
        self.assertEqual('2014-02-21 00:03', entry_model.updated_stftime)

    def test_count(self):
        c = EntryModel.count(1)
        self.assertEqual(2, c)
        c = EntryModel.count(1, 1392942999)
        self.assertEqual(1, c)

    def test_get_entries(self):
        empty = EntryModel.get_entries(1000, 1)
        self.assertEqual(len([]), len(empty))
        entries = EntryModel.get_entries(1, 1)
        self.assertEqual(len(entries), 2)
        self.assertTrue(isinstance(entries[0], EntryModel))
        entries = EntryModel.get_entries(1, 1, 1392942999)
        self.assertEqual(len(entries), 1)

    def test_get_timeline(self):
        empty = EntryModel.get_timeline(1000, 1)
        self.assertEqual(len([]), len(empty))
        entries = EntryModel.get_timeline(1, 1)
        self.assertEqual(len(entries), 2)
        self.assertTrue(isinstance(entries[0], EntryModel))

    def test_get_folder(self):
        empty = EntryModel.get_folder([1000, 1001], 1)
        self.assertEqual(len([]), len(empty))
        entries = EntryModel.get_folder([1, 2], 1)
        self.assertEqual(len(entries), 3)
        self.assertTrue(isinstance(entries[0], EntryModel))

    def test_get_content(self):
        updated_parsed = datetime.date(2013, 11, 23).timetuple()
        entry = FeedParserDict({
            "link": "http://example.con/1",
            "title": "test1 title",
            "updated_parsed": updated_parsed,
            "content": [{"value": "content"}],
            "summary": "summary"
        })
        content = EntryModel.get_content(entry)
        self.assertEqual(content, "content")
        entry = FeedParserDict({
            "link": "http://example.con/1",
            "title": "test1 title",
            "updated_parsed": updated_parsed,
            "content": [{"value": "t" * (MAX_CONTENT_LENGTH + 1)}],
            "summary": "summary"
        })
        content = EntryModel.get_content(entry)
        self.assertEqual(content, "summary")
