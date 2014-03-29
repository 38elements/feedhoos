from django.test import TestCase
from feedhoos.reader.models.bookmark import BookmarkModel


class BookmarkModelTestCase(TestCase):
    fixtures = [
        'feedhoos/fixtures/bookmark.json',
    ]

    def setUp(self):
        super(BookmarkModelTestCase, self).setUp()

    def tearDown(self):
        super(BookmarkModelTestCase, self).tearDown()

    def test_get_json(self):
        result = """{"1": {"rating": 5, "folder_id": 0}, "0": {"rating": 6,""" \
            """ "folder_id": 0}, "2": {"rating": 0, "folder_id": 3}}"""
        bookmark_models = BookmarkModel.objects.filter(id__in=[1, 2])
        bookmark_json = BookmarkModel.get_json(bookmark_models)
        self.assertEqual(result, bookmark_json)
