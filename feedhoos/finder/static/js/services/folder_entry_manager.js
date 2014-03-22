(function () {
    function folderEntryManager($http, baseEntryManager){
        angular.extend(this, baseEntryManager);
        this.$http = $http;
        this.data = null;
        this.store = {};
        this.message = "folder_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "timeline";
        this.set_url = function(folder_id) {
            this.url = "/folder/read/" + folder_id + "/page/1/";
        }
    }
    feedhoos.service("folderEntryManager", ["$http", "baseEntryManager", folderEntryManager]);
})();
