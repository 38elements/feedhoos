(function () {
    function bookmarkManager($http, $rootScope, baseManager){
        angular.extend(this, baseManager);
        this.$http = $http;
        this.data = null;
        this.message = "bookmark";
        this.url = "/bookmark/list/";
        this.folder_url = "/bookmark/folder/";
        this.remove = function(feed_id) {
            if (this.data !== null) {
                delete this.data[feed_id + ""]
                $rootScope.$broadcast(this.message);
            }
        }
        this.add = function(feed_id) {
            feed_id = feed_id + "";
            if (this.data !== null) {
                this.data[feed_id] = {"rating": 0, "folder_id": 0}
                $rootScope.$broadcast(this.message);
            }
        }
        this.set_rating = function(feed_id, rating) {
            feed_id = feed_id + "";
            if (this.data !== null && feed_id in this.data) {
                this.data[feed_id]["rating"] = rating;
                $rootScope.$broadcast(this.message);
            }
        }
        this.get_folder_id = function(feed_id) {
            feed_id = feed_id + "";
            if (this.data !== null && feed_id in this.data) {
                return this.data[feed_id]["folder_id"];
            }
        }
        this.set_folder_id = function(feed_id, folder_id) {
            feed_id = feed_id + "";
            if (this.data !== null && feed_id in this.data) {
                this.data[feed_id]["folder_id"] = folder_id;
                $rootScope.$broadcast(this.message);
                this._send_folder_id(feed_id, folder_id);
            }
        }
        this._send_folder_id = function(feed_id, folder_id) {
            var that = this;
            this.$http({
                 "url": this.folder_url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                 "data": "feed_id=" + encodeURIComponent(feed_id) + "&folder_id=" + encodeURIComponent(folder_id) 
            }).success(function(data) {
            });
        };
        this.get_folder_id = function(feed_id) {
            return this.data[feed_id + ""].folder_id;
        }
        //指定したfolder_idに関連しているfeed_idを返す
        this.get_feed_ids_by_folder_id = function(folder_id) {
            folder_id = folder_id - 0;
            var feed_ids = Object.keys(this.data).map(function(id) {return id - 0})
            if (folder_id === 0) {
                //「登録されているすべてのfeed」を除外
                return feed_ids.filter(function(id) {return id > 0;});
            }
            return feed_ids.filter(function(id) { return this.data[id + ""].folder_id === folder_id  }, this);
        }
        this.remove_folder = function(folder_id) {
            var that = this;
            folder_id = folder_id - 0;
            Object.keys(this.data).map(
                function(key) {
                    var d = that.data[key];
                    if (d.folder_id === folder_id) {
                        d.folder_id = 0;
                    }
                }
            );
            $rootScope.$broadcast(this.message);
        }
    }
    feedhoos.service("bookmarkManager", ["$http", "$rootScope", "baseManager", bookmarkManager]);
})();
