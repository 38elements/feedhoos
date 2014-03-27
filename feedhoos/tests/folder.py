from django.test import TestCase
from feedhoos.folder.models.folder import FolderModel


class FolderModelTestCase(TestCase):
    fixtures = ['folder.json']

    def setUp(self):
        super(FolderModelTestCase, self).setUp()

    def tearDown(self):
        super(FolderModelTestCase, self).tearDown()

    def test_get_json(self):
        folder_models = FolderModel.objects.all()
        folder_json = FolderModel.get_json(folder_models)
        result = """[{"rating": 2, "type": "folder", "id": 2, "title": "74"}, {"rating": 5, "type": "folder", "id": 3, "title": "a"}]"""
        self.assertEqual(result, folder_json)
