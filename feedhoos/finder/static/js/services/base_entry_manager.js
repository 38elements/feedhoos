(function () {
    function baseEntryManager(baseManager) {
        angular.extend(this, baseManager);
        this._is_skip = function(scope, feed_id, feed_type) {
            if (scope._feed_id == feed_id && scope.type == this.type) {
                // timelineにはfolderとfeedがあって、
                // それらは同じidでも別の内容を持っていることがあるため
                // typeで異なる内容かを判断する
                if (scope.type == "timeline" && scope.active_timeline_type !== feed_type ) {
                }
                else {
                    return true;
                }
            }
            return false
        };
        //サーバからデータを得る
        this.set_entries = function(scope, feed_id) {
            this.set_url(feed_id);
            this.set(scope, function(scope, that) {
                    //２つのリクエストが進行しているときの対応
                    //最後にリクエストしたfeedをscopeに格納する
                    if (scope._feed_id == feed_id && scope.type == that.type) {
                        scope.feed = that.data.feed;
                        scope.entries = that.data.entries;
                    }
                    //リクエスト結果のidの値がリクエストしたidと同じ時は
                    //格納する
                    if (feed_id == that.data.feed.id) {
                        that.store[feed_id] = that.data;
                    }
                },
                (this.message + feed_id),
                true
            );
        }
        this.read_feed = function(scope, feed_id, feed_type) {
            feed_id = feed_id + "";
            if (this._is_skip(scope, feed_id, feed_type)) {
                return;
            }

            scope._feed_id = feed_id;
            scope.type = this.type;
            scope.active_timeline_type = feed_type;

            if (feed_id in this.store) {
                var data = this.store[feed_id];
                scope.feed = data.feed;
                scope.entries = data.entries;
                return
            }
            else {
                this.set_entries(scope, feed_id);
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
        this.remove = function(feed_id) {
            feed_id = feed_id + "";
            delete this.store[feed_id];
        }
    }
    feedhoos.service("baseEntryManager", ["baseManager", baseEntryManager]);
})();
