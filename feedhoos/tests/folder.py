from django.test import TestCase
from feedhoos.folder.models.folder import FolderModel
from feedhoos.reader.models.bookmark import BookmarkModel


class FolderModelTestCase(TestCase):
    fixtures = [
        'feedhoos/fixtures/folder.json',
        'feedhoos/fixtures/bookmark.json',
    ]

    def setUp(self):
        super(FolderModelTestCase, self).setUp()

    def tearDown(self):
        super(FolderModelTestCase, self).tearDown()

    def test_get_json(self):
        folder_models = FolderModel.objects.all()
        folder_json = FolderModel.get_json(folder_models)
        result = '[{"rating": 2, "type": "folder", "id": 1, "title": "folder_title1"}, {"rating": 5, "type": "folder", "id": 2, "title": "folder_title2"}, {"rating": 1, "type": "folder", "id": 3, "title": "folder_title3"}]'
        self.assertEqual(result, folder_json)

    def test_dict(self):
        folder_model = FolderModel.objects.get(id=1)
        folder_dict = folder_model.dict
        result = {
            'id': 1,
            'rating': 2,
            'title': 'folder_title1',
            'type': 'folder'
        }
        self.assertEqual(result, folder_dict)

    def test_delete_and_change_bookmark(self):
        FolderModel.delete_and_change_bookmark(1)
        self.assertRaises(FolderModel.DoesNotExist, FolderModel.objects.get, pk=1)
        b1 = BookmarkModel.objects.get(pk=4)
        b2 = BookmarkModel.objects.get(pk=5)
        self.assertEqual(b1.folder_id, 0)
        self.assertEqual(b2.folder_id, 0)
