describe("timelineManager", function() {
    var scope,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $httpBackend.expect("GET", "/reader/feed/list/all/")
            .respond('[' +
                '{"url": "", "type": "feed", "link": "", "id": 0, "title": "すべてのFeed"},' +
                '{"url": "http://example.com/hotentry/it.rss", "type": "feed", "link": "http://b.example.com/hotentry/it", "id": 1, "title": "title1"},' +
                '{"url": "http://www.example.com/blog/feed", "type": "feed", "link": "http://www.example.com/blog", "id": 2, "title": "title2"},' +
                '{"url": "https://www.example.com/projects.xml", "type": "feed", "link": "https://www.example.com/projects", "id": 3, "title": "title3"}' +
            ']');
    }));
    it('should set',inject(function($rootScope, timelineManager) {
        expect(timelineManager.data).toBeNull();
        timelineManager.set(scope, function() {});
        $httpBackend.flush();
        expect(timelineManager.data.length).toEqual(4);
    }));
});
