(function () {
    function readingManager($http, bookmarkManager, baseFeedManager) {
        angular.extend(this, baseFeedManager);
        this.$http = $http;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "readings";
        this.url = "/reader/feed/reading/";
    };
    feedhoos.service("readingManager", ["$http", "bookmarkManager", "baseFeedManager", readingManager]);
})();
