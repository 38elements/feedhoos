describe("readingManager", function() {
    var scope,
        response_data,
        $httpBackend;
    beforeEach(angular.mock.module("feedhoos"));
    beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $httpBackend.expect("GET", "/reader/feed/reading/")
            .respond('[' +
                '{' +
                    '"id": 1,' +
                    '"link": "http://example.com/hotentry/it",' +
                    '"title": "人気エントリー - テクノロジー",' +
                    '"type": "feed",' +
                    '"unread_count": 41,' +
                    '"url": "http://example.com/hotentry/it.rss"' +
                '},' +
                '{' +
                    '"id": 3,' +
                    '"link": "http://example.com/entry/",' +
                    '"title": "テクノロジー",' +
                    '"type": "feed",' +
                    '"unread_count": 5,' +
                    '"url": "http://example.com/entry.rss"' +
                '},' +
                '{' +
                    '"id": 6,' +
                    '"link": "http://example.com/entry/",' +
                    '"title": "テクノ",' +
                    '"type": "feed",' +
                    '"unread_count": 106,' +
                    '"url": "http://example.com/entry.rss"' +
                '}' +
            ']');
        response_data = [ 
            { 
                "id": 1, 
                "link": "http://example.com/hotentry/it", 
                "title": "人気エントリー - テクノロジー", 
                "type": "feed", 
                "unread_count": 41, 
                "url": "http://example.com/hotentry/it.rss"
            }, 
            { 
                "id": 3, 
                "link": "http://example.com/entry/", 
                "title": "テクノロジー", 
                "type": "feed", 
                "unread_count": 5, 
                "url": "http://example.com/entry.rss"
            }, 
            { 
                "id": 6, 
                "link": "http://example.com/entry/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry.rss"
            } 
        ];
    }));

    it('should set',inject(function(readingManager) {
        readingManager.set(scope, function() {});
        $httpBackend.flush();
        expect(readingManager.data).toEqual(response_data);
    }));

    it('should attachRating is add rating property timeline feed data',inject(function(readingManager, bookmarkManager) {
        $httpBackend.expect("GET", "/bookmark/list/")
            .respond('{' +
                '"0": {"rating": 6, "folder_id": 0},' +
                '"1": {"rating": 3, "folder_id": 1},' +
                '"2": {"rating": 0, "folder_id": 0},' +
                '"3": {"rating": 0, "folder_id": 2},' +
                '"4": {"rating": 3, "folder_id": 6},' +
                '"5": {"rating": 0, "folder_id": 0},' +
                '"6": {"rating": 5, "folder_id": 0},' +
                '"7": {"rating": 1, "folder_id": 2}' +
            '}');
        readingManager.set(scope, function() {});
        bookmarkManager.set(scope, function() {});
        $httpBackend.flush();
        readingManager.attachRating();
        var data =  readingManager.data;
        var expecting_data = [ 
            { 
                "id": 1, 
                "rating": 3,
                "link": "http://example.com/hotentry/it", 
                "title": "人気エントリー - テクノロジー", 
                "type": "feed", 
                "unread_count": 41, 
                "url": "http://example.com/hotentry/it.rss"
            }, 
            { 
                "id": 3, 
                "rating": 0,
                "link": "http://example.com/entry/", 
                "title": "テクノロジー", 
                "type": "feed", 
                "unread_count": 5, 
                "url": "http://example.com/entry.rss"
            }, 
            { 
                "id": 6, 
                "rating": 5,
                "link": "http://example.com/entry/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry.rss"
            } 
        ];
        expect(expecting_data).toEqual(data);
    }));

    it('should add one data ',inject(function(readingManager) {
        readingManager.set(scope, function() {});
        $httpBackend.flush();
        readingManager.add(
            { 
                "id": 8, 
                "link": "http://example.com/entry001/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry001.rss"
            } 
        );

        var expecting_data = [ 
            { 
                "id": 1, 
                "link": "http://example.com/hotentry/it", 
                "title": "人気エントリー - テクノロジー", 
                "type": "feed", 
                "unread_count": 41, 
                "url": "http://example.com/hotentry/it.rss"
            }, 
            { 
                "id": 3, 
                "link": "http://example.com/entry/", 
                "title": "テクノロジー", 
                "type": "feed", 
                "unread_count": 5, 
                "url": "http://example.com/entry.rss"
            }, 
            { 
                "id": 6, 
                "link": "http://example.com/entry/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry.rss"
            }, 
            { 
                "id": 8, 
                "link": "http://example.com/entry001/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry001.rss"
            } 
        ];
        expect(expecting_data).toEqual(readingManager.data);
    }));

    it('should remove one data ',inject(function(readingManager) {
        readingManager.set(scope, function() {});
        $httpBackend.flush();
        readingManager.remove(3);
        var expecting_data = [ 
            { 
                "id": 1, 
                "link": "http://example.com/hotentry/it", 
                "title": "人気エントリー - テクノロジー", 
                "type": "feed", 
                "unread_count": 41, 
                "url": "http://example.com/hotentry/it.rss"
            }, 
            { 
                "id": 6, 
                "link": "http://example.com/entry/", 
                "title": "テクノ", 
                "type": "feed", 
                "unread_count": 106, 
                "url": "http://example.com/entry.rss"
            } 
        ];
        expect(expecting_data).toEqual(readingManager.data);
    }));
});
