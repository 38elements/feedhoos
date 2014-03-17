(function () {
    function baseFeedManager($rootScope, baseManager) {
        angular.extend(this, baseManager);
        this.add = function(one) {
            if (this.data !== null) {
                this.data.push(one);
                $rootScope.$broadcast(this.message);
            }
        }
        this.remove = function(feed_id) {
            if (this.data !== null) {
                this.data = this.data.filter(function(f) {
                    return f.id != feed_id;
                });
                $rootScope.$broadcast(this.message);
            }
        }
        this.sortByRating = function(data) {
            var that = this;
            data.sort(
                function(a, b) {
                    var a_rating,
                        b_rating;
                    a_rating = that.bookmarkManager.data[a.id + ""]["rating"]; 
                    b_rating = that.bookmarkManager.data[b.id + ""]["rating"]; 
                    if (a_rating < b_rating) {
                        return 1;
                    }
                    else if (a_rating > b_rating) {
                        return -1;
                    }
                    else {
                        return 0
                    }
                }
            );
            return data;
        }
    };
    feedhoos.service("baseFeedManager", ["$rootScope", "baseManager", baseFeedManager]);
})();
