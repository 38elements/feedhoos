(function () {
    function baseEntryManager(baseManager) {
        angular.extend(this, baseManager);
        this.read_feed = function(scope, feed_id, feed_type) {
            feed_id = feed_id + "";
            if (scope._feed_id == feed_id && scope.type == this.type) {
                if (scope.type == "timeline" && scope.active_timeline_type !== feed_type ) {
                }
                else {
                    return;
                }
            }

            scope._feed_id = feed_id;
            scope.type = this.type;
            scope.active_timeline_type = feed_type;

            this.set_url(feed_id);
            if (feed_id in this.store) {
                var data = this.store[feed_id];
                scope.feed = data.feed;
                scope.entries = data.entries;
                return
            }
            else {
                this.set(scope, function(scope, that) {
                        if (scope._feed_id == feed_id && scope.type == that.type) {
                            scope.feed = that.data.feed;
                            scope.entries = that.data.entries;
                        }
                        if (feed_id == that.data.feed.id) {
                            that.store[feed_id] = that.data;
                        }
                    },
                    (this.message + feed_id),
                    true
                );
                // readingの未読数を0にする。
                if (this.type == "feed") {
                    scope.readings.map(function(feed){
                        if (feed.id == feed_id) {
                            feed.unread_count = 0;
                        }
                    });
                }
            }
        }
    }
    feedhoos.service("baseEntryManager", ["baseManager", baseEntryManager]);
})();
