describe("folderManager", function() {
    var scope,
        response_data,
        defalt_id,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        defalt_id = 0;
        $httpBackend = _$httpBackend_;
        $httpBackend.expect("GET", "/folder/list/")
            .respond('[{"rating": 1, "type": "folder", "id": 1, "title": "title1"}, {"rating": 5, "type": "folder", "id": 2, "title": "title2"}, {"rating": 0, "type": "folder", "id": 3, "title": "title3"}]');
        response_data = [
            {"rating": 1, "type": "folder", "id": 1, "title": "title1"},
            {"rating": 5, "type": "folder", "id": 2, "title": "title2"},
            {"rating": 0, "type": "folder", "id": 3, "title": "title3"}
        ];
    }));

    it('should set', inject(function(folderManager) {
        folderManager.set(scope, function() {});
        $httpBackend.flush();
        expect(folderManager.data).toEqual(response_data);
    }));

    it('should defalt title is ---', inject(function(folderManager) {
        folderManager.set(scope, function() {});
        $httpBackend.flush();
        expect(folderManager.get_title(0)).toEqual('---');
    }));

    it('should title', inject(function(folderManager) {
        folderManager.set(scope, function() {});
        $httpBackend.flush();
        expect(folderManager.get_title(2)).toEqual('title2');
    }));

    it('should get_title_by_feed_id', inject(function(folderManager, bookmarkManager) {
        $httpBackend.expect("GET", "/bookmark/list/")
            .respond('{' +
                '"0": {"rating": 6, "folder_id": 0},' +
                '"1": {"rating": 3, "folder_id": 1},' +
                '"2": {"rating": 0, "folder_id": 0},' +
                '"3": {"rating": 0, "folder_id": 2},' +
                '"4": {"rating": 3, "folder_id": 0},' +
                '"5": {"rating": 0, "folder_id": 0},' +
                '"6": {"rating": 5, "folder_id": 0},' +
                '"7": {"rating": 1, "folder_id": 2}' +
            '}');
        folderManager.set(scope, function() {});
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        expect(folderManager.get_title_by_feed_id(2)).toEqual('---');
        expect(folderManager.get_title_by_feed_id(1)).toEqual('title1');
    }));
});
