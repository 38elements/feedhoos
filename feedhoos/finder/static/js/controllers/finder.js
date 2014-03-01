feedhoosControllers.controller("FinderCtrl", ["$scope", "$http", "$cookies", "timelineManager", "readingManager", "bookmarkManager",
    function($scope, $http, $cookies, timelineManager, readingManager, bookmarkManager) {
        $scope.state = 1;
        $scope.set_state = function(state) {
            $scope.url = null;
            $scope.feed_urls = null;
            $scope.result = null;
            $scope.state = state;
        }
        $scope.search = function() {
            $scope.state = 2;
            $scope.feed_urls = null;
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/finder/get/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "url=" + encodeURIComponent($scope.url)
            }).success(function(data) {
                $scope.feed_urls = data;
            });
        }
        $scope.add = function(fu) {
            $scope.state = 3;
            $scope.result = null;
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/finder/registered/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "url=" + encodeURIComponent(fu)
            }).success(function(data) {
                if (data.msg === "ok") {
                    $scope.result = data;
                    timelineManager.add(data.feed);
                    readingManager.add(data.reading);
                    bookmarkManager.add(data.feed.id);
                }
            });
        }
    }]
);
