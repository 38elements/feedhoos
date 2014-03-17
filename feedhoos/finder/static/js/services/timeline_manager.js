(function () {
    function timelineManager($http, bookmarkManager, baseFeedManager){
        angular.extend(this, baseFeedManager);
        this.$http = $http;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "feeds";
        this.url = "/reader/feed/list/all/";
        this.get_data_by_folder_id = function(folder_id) {
            var feed_ids = this.bookmarkManager.get_feed_ids_by_folder_id(folder_id);
            var data = this.data.filter(function(d) {
                return feed_ids.indexOf(d.id) > -1;
            });
            return data;
        }
    }
    feedhoos.service("timelineManager", ["$http", "bookmarkManager", "baseFeedManager", timelineManager]);
})();
