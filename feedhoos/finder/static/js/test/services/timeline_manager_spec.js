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

    it('should set', inject(function(timelineManager) {
        timelineManager.set(scope, function() {});
        $httpBackend.flush();
        expect(timelineManager.data.length).toEqual(4);
    }));

    it('should get_feed_ids_by_folder_id',inject(function(timelineManager, bookmarkManager) {
        $httpBackend.expect("GET", "/bookmark/list/")
            .respond('{' +
                '"0": {"rating": 6, "folder_id": 0},' +
                '"1": {"rating": 3, "folder_id": 2},' +
                '"2": {"rating": 0, "folder_id": 0},' +
                '"3": {"rating": 1, "folder_id": 2}' +
            '}');
        timelineManager.set(scope, function() {});
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        var data = timelineManager.get_data_by_folder_id(2);
        expect(data.length).toEqual(2);
        expect(data[0].id).toEqual(1);
        expect(data[1].id).toEqual(3);
    }));

    it('should attachRating is add rating property timeline feed data',inject(function(timelineManager, bookmarkManager) {
        $httpBackend.expect("GET", "/bookmark/list/")
            .respond('{' +
                '"0": {"rating": 6, "folder_id": 0},' +
                '"1": {"rating": 3, "folder_id": 2},' +
                '"2": {"rating": 0, "folder_id": 0},' +
                '"3": {"rating": 1, "folder_id": 2}' +
            '}');
        timelineManager.set(scope, function() {});
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        timelineManager.attachRating();
        var data =  timelineManager.data;
        var expecting_data = [
                {"rating": 6, "url": "", "type": "feed", "link": "", "id": 0, "title": "すべてのFeed"},
                {"rating": 3, "url": "http://example.com/hotentry/it.rss", "type": "feed", "link": "http://b.example.com/hotentry/it", "id": 1, "title": "title1"},
                {"rating": 0, "url": "http://www.example.com/blog/feed", "type": "feed", "link": "http://www.example.com/blog", "id": 2, "title": "title2"},
                {"rating": 1, "url": "https://www.example.com/projects.xml", "type": "feed", "link": "https://www.example.com/projects", "id": 3, "title": "title3"}
            ];
        expect(expecting_data).toEqual(data);
    }));

    it('should add one data ',inject(function(timelineManager) {
        timelineManager.set(scope, function() {});
        $httpBackend.flush();
        timelineManager.add({"url": "http://www.example.com/blog9/feed", "type": "feed", "link": "http://www.example.com/blog9", "id": 9, "title": "title9"});
        var expecting_data = [
                {"url": "", "type": "feed", "link": "", "id": 0, "title": "すべてのFeed"},
                {"url": "http://example.com/hotentry/it.rss", "type": "feed", "link": "http://b.example.com/hotentry/it", "id": 1, "title": "title1"},
                {"url": "http://www.example.com/blog/feed", "type": "feed", "link": "http://www.example.com/blog", "id": 2, "title": "title2"},
                {"url": "https://www.example.com/projects.xml", "type": "feed", "link": "https://www.example.com/projects", "id": 3, "title": "title3"},
                {"url": "http://www.example.com/blog9/feed", "type": "feed", "link": "http://www.example.com/blog9", "id": 9, "title": "title9"}
            ];
        expect(expecting_data).toEqual(timelineManager.data);
    }));

    it('should remove one data ',inject(function(timelineManager) {
        timelineManager.set(scope, function() {});
        $httpBackend.flush();
        timelineManager.remove(2);
        var expecting_data = [
                {"url": "", "type": "feed", "link": "", "id": 0, "title": "すべてのFeed"},
                {"url": "http://example.com/hotentry/it.rss", "type": "feed", "link": "http://b.example.com/hotentry/it", "id": 1, "title": "title1"},
                {"url": "https://www.example.com/projects.xml", "type": "feed", "link": "https://www.example.com/projects", "id": 3, "title": "title3"},
            ];
        expect(expecting_data).toEqual(timelineManager.data);
    }));
});
