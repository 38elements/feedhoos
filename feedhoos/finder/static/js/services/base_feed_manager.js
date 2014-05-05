(function () {
    function baseFeedManager($rootScope, baseManager) {
        angular.extend(this, baseManager);
        this.add = function(one) {
            if (this.data !== null) {
                this.data.push(one);
                $rootScope.$broadcast(this.message);
            }
        };
        this.remove = function(feed_id) {
            if (this.data !== null) {
                this.data = this.data.filter(function(f) {
                    return f.id != feed_id;
                });
                $rootScope.$broadcast(this.message);
            }
        };
        this.attachRating = function() {
            var that = this;
            this.data.map(
                function(d) {
                    d.rating = that.bookmarkManager.data[d.id + ""]["rating"]
                }
            );
            return this.data;
        };
    };
    feedhoos.service("baseFeedManager", ["$rootScope", "baseManager", baseFeedManager]);
})();
