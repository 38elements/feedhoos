(function () {
    function baseManager($rootScope) {
        this.set = function(scope, callback, message, is_reset) {
            var that = this;
            message = message || this.message; 
            scope.$on(message, function() {
                callback(scope, that);
            });
            if (is_reset) {
                this.data = null;
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
