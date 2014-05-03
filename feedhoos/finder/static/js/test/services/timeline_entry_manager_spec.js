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
        timelineEntryManager._is_skip(scope, 1, "feed");
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
});
