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
});
