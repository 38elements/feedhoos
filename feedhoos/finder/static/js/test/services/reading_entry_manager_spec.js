describe("readingEntryManager", function() {
    var scope,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
    }));

    it('should set_url', inject(function(readingEntryManager) {
        readingEntryManager.set_url(10);
        var expect_url = "/reader/feed/10/page/1/";
        expect(readingEntryManager.url).toEqual(expect_url);
    }));

    it('should _is_skip', inject(function(readingEntryManager) {
        scope._feed_id = 1;
        scope.type = readingEntryManager.type;
        expect(readingEntryManager._is_skip(scope, 1, "feed")).toEqual(true);
        expect(readingEntryManager._is_skip(scope, 2, "feed")).toEqual(false);
    }));

    it('should set_entries', inject(function(readingEntryManager) {
        $httpBackend.expect("GET", "/reader/feed/2/page/1/")
            .respond('{' +
                '"feed": {"id": 2}' +
            '}');
        readingEntryManager.set_entries(scope, 2);
        $httpBackend.expect("GET", "/reader/feed/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1}' +
            '}');
        readingEntryManager.set_entries(scope, 1);
        $httpBackend.flush();
        expect(readingEntryManager.store["2"]).toEqual({feed:{id:2}});
        expect(readingEntryManager.store["1"]).toEqual({feed:{id:1}});
    }));

    it('should read_feed unread_count', inject(function(readingEntryManager) {
        $httpBackend.expect("GET", "/reader/feed/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1},' +
                '"entries": []' +
            '}');
        scope._feed_id = 2;
        scope.readings = [{id: 1,unread_count: 100}];
        scope.type = readingEntryManager.type;
        scope.active_timeline_type = "feed";
        readingEntryManager.read_feed(scope, 1, "feed"); 
        $httpBackend.flush();
        expect(scope.readings).toEqual([{id: 1,unread_count: 0}]);
    }));

    it('should remove', inject(function(readingEntryManager) {
        readingEntryManager.store = {
            "1": 1,
            "2": 2
        };
        readingEntryManager.remove(1); 
        expect(readingEntryManager.store).toEqual({"2": 2});
    }));
});
