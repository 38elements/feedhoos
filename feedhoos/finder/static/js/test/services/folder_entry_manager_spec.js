describe("folderEntryManager", function() {
    var scope,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
    }));

    it('should set_url', inject(function(folderEntryManager) {
        folderEntryManager.set_url(10);
        var expect_url = "/folder/read/10/page/1/";
        expect(folderEntryManager.url).toEqual(expect_url);
    }));

    it('should _is_skip', inject(function(folderEntryManager) {
        scope._feed_id = 1;
        scope.type = folderEntryManager.type;
        scope.active_timeline_type = "folder";
        expect(folderEntryManager._is_skip(scope, 1, "folder")).toEqual(true);
        expect(folderEntryManager._is_skip(scope, 2, "folder")).toEqual(false);
        expect(folderEntryManager._is_skip(scope, 1, "feed")).toEqual(false);
        expect(folderEntryManager._is_skip(scope, 2, "feed")).toEqual(false);
        scope.type = "feed";
        expect(folderEntryManager._is_skip(scope, 1, "folder")).toEqual(false);
    }));

    it('should set_entries', inject(function(folderEntryManager) {
        $httpBackend.expect("GET", "/folder/read/2/page/1/")
            .respond('{' +
                '"feed": {"id": 2}' +
            '}');
        folderEntryManager.set_entries(scope, 2);
        $httpBackend.expect("GET", "/folder/read/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1}' +
            '}');
        folderEntryManager.set_entries(scope, 1);
        $httpBackend.flush();
        expect(folderEntryManager.store["2"]).toEqual({feed:{id:2}});
        expect(folderEntryManager.store["1"]).toEqual({feed:{id:1}});
    }));

    it('should read_feed _is_skip', inject(function(folderEntryManager) {
        scope._feed_id = 1;
        scope.type = folderEntryManager.type;
        scope.active_folder_type = "folder";
        expect(folderEntryManager.read_feed(scope, 1, "foler")).toEqual(undefined);
    }));
});
