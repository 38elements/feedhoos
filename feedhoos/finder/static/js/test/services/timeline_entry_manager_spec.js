describe("timelineEntryManager", function() {
    var scope,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        /*
        $httpBackend.expect("GET", "/reader/feed/list/all/")
            .respond('[' +
                '{"url": "", "type": "feed", "link": "", "id": 0, "title": "すべてのFeed"},' +
                '{"url": "http://example.com/hotentry/it.rss", "type": "feed", "link": "http://b.example.com/hotentry/it", "id": 1, "title": "title1"},' +
                '{"url": "http://www.example.com/blog/feed", "type": "feed", "link": "http://www.example.com/blog", "id": 2, "title": "title2"},' +
                '{"url": "https://www.example.com/projects.xml", "type": "feed", "link": "https://www.example.com/projects", "id": 3, "title": "title3"}' +
            ']');
        */
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
});
