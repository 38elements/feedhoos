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
            'url': 'http:/example.com/foo3.atom',
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
        l = 1500000000
        self.assertEqual(feed_model1.last_updated, l)
        feed_model2 = FeedModel.objects.get(pk=4)
        self.assertEqual(feed_model2.last_updated, 0)
