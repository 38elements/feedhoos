describe("folderManager", function() {
    var scope,
        response_data,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
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
});
