describe("timelineEntryManager", function() {
    var scope,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
    }));

    it('should set_url', inject(function(timelineEntryManager) {
        timelineEntryManager.set_url(10);
        var expect_url = "/reader/feed/timeline/10/page/1/";
        expect(timelineEntryManager.url).toEqual(expect_url);
    }));

    it('should _is_skip', inject(function(timelineEntryManager) {
        scope._feed_id = 1;
        scope.type = timelineEntryManager.type;
        scope.active_timeline_type = "feed";
        expect(timelineEntryManager._is_skip(scope, 1, "feed")).toEqual(true);
        expect(timelineEntryManager._is_skip(scope, 2, "feed")).toEqual(false);
        expect(timelineEntryManager._is_skip(scope, 1, "folder")).toEqual(false);
        expect(timelineEntryManager._is_skip(scope, 1, "folder")).toEqual(false);
    }));

    it('should set_entries', inject(function(timelineEntryManager) {
        $httpBackend.expect("GET", "/reader/feed/timeline/2/page/1/")
            .respond('{' +
                '"feed": {"id": 2}' +
            '}');
        timelineEntryManager.set_entries(scope, 2);
        $httpBackend.expect("GET", "/reader/feed/timeline/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1}' +
            '}');
        timelineEntryManager.set_entries(scope, 1);
        $httpBackend.flush();
        expect(timelineEntryManager.store["2"]).toEqual({feed:{id:2}});
        expect(timelineEntryManager.store["1"]).toEqual({feed:{id:1}});
        
    }));

    it('should read_feed _is_skip', inject(function(timelineEntryManager) {
        scope._feed_id = 1;
        scope.type = timelineEntryManager.type;
        scope.active_timeline_type = "feed";
        expect(timelineEntryManager.read_feed(scope, 1, "feed")).toEqual(undefined);
    }));

    it('should read_feed in store', inject(function(timelineEntryManager) {
        $httpBackend.expect("GET", "/reader/feed/timeline/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1},' +
                '"entries": []' +
            '}');
        timelineEntryManager.set_entries(scope, 1);
        $httpBackend.flush();
        scope._feed_id = 2;
        scope.type = timelineEntryManager.type;
        scope.active_timeline_type = "feed";
        timelineEntryManager.read_feed(scope, 1, "feed"); 
        expect(scope.entries).toEqual([]);
        expect(scope.feed).toEqual({id: 1});
    }));

    it('should read_feed set_entries', inject(function(timelineEntryManager) {
        $httpBackend.expect("GET", "/reader/feed/timeline/1/page/1/")
            .respond('{' +
                '"feed": {"id": 1},' +
                '"entries": []' +
            '}');
        scope._feed_id = 2;
        scope.type = timelineEntryManager.type;
        scope.active_timeline_type = "feed";
        timelineEntryManager.read_feed(scope, 1, "feed"); 
        $httpBackend.flush();
        expect(scope.entries).toEqual([]);
        expect(scope.feed).toEqual({id: 1});
    }));

    it('should remove', inject(function(timelineEntryManager) {
        timelineEntryManager.store = {
            "1": 1,
            "2": 2
        };
        timelineEntryManager.remove(1); 
        expect(timelineEntryManager.store).toEqual({"2": 2});
    }));
});
