(function () {
    function folderManager($http, bookmarkManager, baseFeedManager){
        angular.extend(this, baseFeedManager);
        var that = this;
        this.$http = $http;
        this.data = null;
        this.message = "folder";
        this.url = "/folder/list/";
        this.create_url = "/folder/create/";
        this.default = {"id": 0, "title": "---", "rating": 6, "type": "folder"};
        this.get_title = function(folder_id) {
            //FIXME 高速化
            folder_id = folder_id - 0;
            if (this.default.id === folder_id) {
                return this.default.title;
            }
            var target_folder = this.data.filter(function(d) {return d.id === folder_id});
            if (target_folder.length > 0) {
                return target_folder[0].title;
            }
            throw new Error("No folder title.");
        }
        this.get_title_by_feed_id = function(feed_id) {
            var folder_id = bookmarkManager.get_folder_id(feed_id);
            return this.get_title(folder_id)
        }
        this.create = function(title, scope, callback) {
            if (!title) {
                callback(scope, that);
                return
            }
            var that = this;
            this.$http({
                 "url": this.create_url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                 "data": "title=" + encodeURIComponent(title)
            }).success(function(data) {
                //folderのデータを追加する処理
                that.data.push(data);
                callback(scope, that);
            });
        };
        this.sortByRating = function() {
            this.data = this.data.sort(
                function(a, b) {
                    if (a.rating < b.rating) {
                        return 1;
                    }
                    else if (a.rating > b.rating) {
                        return -1;
                    }
                    else {
                        return 0
                    }
                }
            );
            return this.data;
        }
    }
    feedhoos.service("folderManager", ["$http", "bookmarkManager", "baseFeedManager",  folderManager]);
})();
