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
});
