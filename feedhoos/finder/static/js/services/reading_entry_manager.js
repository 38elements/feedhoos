(function () {
    function readingEntryManager($http, baseEntryManager){
        angular.extend(this, baseEntryManager);
        this.$http = $http;
        this.data = null;
        this.store = {};
        this.message = "reading_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "feed";
        this.set_url = function(feed_id) {
            this.url = "/reader/feed/" + feed_id + "/page/1/";
        }
    }
    feedhoos.service("readingEntryManager", ["$http", "baseEntryManager", readingEntryManager]);
})();
