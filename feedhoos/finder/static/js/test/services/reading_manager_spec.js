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
});
