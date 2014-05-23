(function () {
    function baseManager($rootScope) {
        this._get_delete_on_func_name = function(message) {
            return this._prefix_delete_on_func + message;
        }
        this._prefix_delete_on_func = "_delete_on_func_";
        this.set = function(scope, callback, message, is_reset) {
            var that = this,
                current_scope;
            message = message || this.message; 
            if (is_reset) {
                this.data = null;
                var delete_on_func_name = this._get_delete_on_func_name(message);
                if (scope[delete_on_func_name]) {
                    scope[delete_on_func_name]();
                }
            }
            //1つのメッセージあたり1つのハンドラしか登録できないようにする。
            if (!Array.isArray(scope.$$listeners[message]) || scope.$$listeners[message].length < 1) {
                var delete_on_func_name = this._get_delete_on_func_name(message);
                scope[delete_on_func_name] = scope.$on(message, function() {
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
