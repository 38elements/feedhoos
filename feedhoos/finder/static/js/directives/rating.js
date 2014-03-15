feedhoos.controller("RatingCtrl", ["$scope", "$http", "bookmarkManager", 
    function($scope, $http, bookmarkManager) {
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.bookmark = null;
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        $scope.watch_rating = function() {
            this.unwatch_rating = $scope.$watch("rating", function(new_rating, old_rating) {
                var url = "";
                if (new_rating == old_rating) {
                    return;
                }
                if ($scope.type == "feed") {
                    url = "/bookmark/rating/";
                    bookmarkManager.set_rating($scope.feed_id, new_rating);
                }
                $http({
                     "url": url,
                     "method": "POST",
                     "xsrfHeaderName": "X-CSRFToken",
                     "xsrfCookieName": "csrftoken",
                     "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                     "data": ("id=" + $scope.feed_id + "&rating=" + $scope.rating)
                }).success(function(data) {
                    $scope.result = data;
                });
            });
        }
    }]
);

feedhoos.directive("fhRating", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {
            type: "@type",
            feed_id: "@feedId",
        }, 
        controller: "RatingCtrl",
        link: function(scope, element, attrs, controller) {
            scope.rating = scope.bookmark[attrs.feedId + ""].rating;
            scope.watch_rating();
            //readerでのratingの変更に対応するため
            scope.$watch(function() { 
                    return element.attr("feed-id");
                },
                function (new_feed_id, old_feed_id) {
                    if (new_feed_id != old_feed_id) {
                        scope.unwatch_rating();
                        scope.rating = scope.bookmark[attrs.feedId + ""].rating;
                        scope.watch_rating();
                    }
                }
            );
        },
        template: '<span><span class="glyphicon glyphicon-arrow-left" ng-click="rating = 0"></span> <rating value="rating" max="max" readonly="false"></rating></span>'
    }
});
