from django.test import TestCase
from feedhoos.finder.models.feed import FeedModel


class FeedModelTestCase(TestCase):
    fixtures = [
        'feedhoos/fixtures/feed.json',
        'feedhoos/fixtures/bookmark.json',
        'feedhoos/fixtures/entry.json',
    ]

    def setUp(self):
        super(FeedModelTestCase, self).setUp()

    def tearDown(self):
        super(FeedModelTestCase, self).tearDown()

    def test_dict(self):
        feed_model = FeedModel.objects.get(pk=3)
        d = {
            'url': 'http://127.0.0.1:45000/atom',
            'type': 'feed',
            'link': 'http:/example.com/foo3',
            'id': 3,
            'title': 'title3'
        }
        self.assertEqual(feed_model.dict, d)

    def test_unread_count(self):
        feed_model = FeedModel.objects.get(pk=3)
        self.assertEqual(feed_model.unread_count, 2)

    def test_reading_dict(self):
        feed_model = FeedModel.objects.get(pk=3)
        d = feed_model.dict
        d["unread_count"] = feed_model.unread_count
        self.assertEqual(feed_model.reading_dict, d)

    def test_last_updated(self):
        feed_model1 = FeedModel.objects.get(pk=3)
        l = 1396704170
        self.assertEqual(feed_model1.last_updated, l)
        feed_model2 = FeedModel.objects.get(pk=4)
        self.assertEqual(feed_model2.last_updated, 0)

    def test_new_entries(self):
        feed_model = FeedModel.objects.get(pk=3)
        new_entries = feed_model.new_entries
        self.assertEqual(len(new_entries), 1)
        self.assertEqual(new_entries[0]["updated"], '2014-04-05T13:22:51Z')

    def test_feed(self):
        feed_model = FeedModel.objects.get(pk=3)
        feed_model.feed
        self.assertEqual(len(feed_model.entries), 3)
