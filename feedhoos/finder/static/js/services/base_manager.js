(function () {
    function baseManager($rootScope) {
        this.set = function(scope, callback, message, is_reset) {
            var that = this,
                current_scope,
                message = message || this.message; 
            if (is_reset) {
                this.data = null;
                scope.$$listeners[message] = [];
                current_scope = scope;
                do {
                    if (message in current_scope.$$listenerCount && current_scope.$$listenerCount[message] >= 1) {
                        current_scope.$$listenerCount[message] -= 1;
                        if (current_scope.$$listenerCount[message] === 0) {
                            delete current_scope.$$listenerCount[message];
                        }
                    }
                } while ((current_scope = current_scope.$parent));
            }
            //1つのメッセージあたり1つのハンドラしか登録できないようにする。
            if (!Array.isArray(scope.$$listeners[message]) || scope.$$listeners[message].length < 1) {
                scope.$on(message, function() {
                    callback(scope, that);
                });
            }
            if (this.data === null) {
                this.$http.get(this.url).success(function(data) {
                    that.data = data;
                    $rootScope.$broadcast(message);
                });
            }
            else {
                $rootScope.$broadcast(message);
            }
        };
        this.wait = function(timeout, time, predict_func, callback) {
            if (predict_func()) {
                var that = this;
                var _wait = function() {
                    that.wait(timeout, time, predict_func, callback); 
                }
                timeout(_wait, time);
            }
            else {
                callback();
            }
        }
    }
    feedhoos.service("baseManager", ["$rootScope", baseManager]);
})();
