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

    it('should get_folder_id', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        expect(bookmarkManager.get_folder_id(1)).toEqual(3);
    }));

    it('should set_folder_id', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        var feed_id = 1;
        var folder_id = 5;
        $httpBackend.expect("POST", bookmarkManager.folder_url, "feed_id=" + encodeURIComponent(feed_id) + "&folder_id=" + encodeURIComponent(folder_id))
            .respond();
        bookmarkManager.set_folder_id(feed_id, folder_id);
        $httpBackend.flush();
        expect(bookmarkManager.get_folder_id(1)).toEqual(5);
    }));

    it('should get_feed_ids_by_folder_id', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        expect(bookmarkManager.get_feed_ids_by_folder_id(1)).toEqual([2]);
    }));

    it('should remove_folder', inject(function(bookmarkManager) {
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        bookmarkManager.remove_folder(3);
        expect_data = {
            "2": {"rating": 3, "folder_id": 1},
            "0": {"rating": 6, "folder_id": 0}, 
            "3": {"rating": 0, "folder_id": 0},
            "1": {"rating": 5, "folder_id": 0}  
        };
        expect(bookmarkManager.data).toEqual(expect_data);
    }));
});
