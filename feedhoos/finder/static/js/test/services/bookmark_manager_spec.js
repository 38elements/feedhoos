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

    it('should remove', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        var expect_data = {
            "2": {"rating": 3, "folder_id": 1},
            "0": {"rating": 6, "folder_id": 0}, 
            "3": {"rating": 0, "folder_id": 3},
        };
        bookmarkManager.remove(1);
        expect(bookmarkManager.data).toEqual(expect_data);
    }));

    it('should add', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        var expect_data = {
            "8": {"rating": 0, "folder_id": 0},
            "2": {"rating": 3, "folder_id": 1},
            "0": {"rating": 6, "folder_id": 0}, 
            "3": {"rating": 0, "folder_id": 3},
            "1": {"rating": 5, "folder_id": 3}  
        };
        bookmarkManager.add(8);
        expect(bookmarkManager.data).toEqual(expect_data);
    }));

    it('should set_rating', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        var expect_data = {
            "2": {"rating": 5, "folder_id": 1},
            "0": {"rating": 6, "folder_id": 0}, 
            "3": {"rating": 0, "folder_id": 3},
            "1": {"rating": 5, "folder_id": 3}  
        };
        bookmarkManager.set_rating(2, 5);
        expect(bookmarkManager.data).toEqual(expect_data);
    }));
});
