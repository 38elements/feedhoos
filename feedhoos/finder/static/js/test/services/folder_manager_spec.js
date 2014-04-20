describe("folderManager", function() {
    var scope,
        response_data,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $httpBackend.expect("GET", "/folder/list/")
            .respond('[{"rating": 1, "type": "folder", "id": 1, "title": "title1"}, {"rating": 5, "type": "folder", "id": 2, "title": "title2"}]');
        response_data = [
            {"rating": 1, "type": "folder", "id": 1, "title": "title1"},
            {"rating": 5, "type": "folder", "id": 2, "title": "title2"}
        ];
    }));

    it('should set', inject(function(folderManager) {
        folderManager.set(scope, function() {});
        $httpBackend.flush();
        expect(folderManager.data.length).toEqual(2);
    }));
});
