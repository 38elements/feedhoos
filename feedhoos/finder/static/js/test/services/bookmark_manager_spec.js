describe("bookmarkManager", function() {
    var scope,
        response_data,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        defalt_id = 0;
        $httpBackend = _$httpBackend_;
        $httpBackend.expect("GET", "/bookmark/list/")
            .respond('{' + 
                '"2": {"rating": 3, "folder_id": 1},' +
                '"0": {"rating": 6, "folder_id": 0},' + 
                '"3": {"rating": 0, "folder_id": 3},' +
                '"1": {"rating": 5, "folder_id": 3}' + 
            '}');
        response_data = {
            "2": {"rating": 3, "folder_id": 1},
            "0": {"rating": 6, "folder_id": 0}, 
            "3": {"rating": 0, "folder_id": 3},
            "1": {"rating": 5, "folder_id": 3}  
        };
    }));


    it('should set', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        expect(bookmarkManager.data).toEqual(response_data);
    }));
});
