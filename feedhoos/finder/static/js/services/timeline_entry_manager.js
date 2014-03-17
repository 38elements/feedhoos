(function () {
    function timelineEntryManager($http, baseEntryManager){
        angular.extend(this, baseEntryManager);
        this.$http = $http;
        this.data = null;
        this.store = {};
        this.message = "timeline_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "timeline";
        this.set_url = function(feed_id) {
            this.url = "/reader/feed/timeline/" + feed_id + "/page/1/";
        }
    }
    feedhoos.service("timelineEntryManager", ["$http", "baseEntryManager", timelineEntryManager]);
}());
