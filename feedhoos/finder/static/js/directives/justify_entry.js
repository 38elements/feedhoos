feedhoos.directive("fhJustifyEntry", function($window, $timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attrs, ReaderCtrl) {
            scope.$watch(function() {
                if (scope.feed) {
                    return (scope.feed.id + scope.type + scope.feed.type);
                }
                else {
                    return scope.feed;
                }
            }, function() {
                $timeout(
                    function() {
                        var content_bar = $window.document.getElementById("content_bar");
                        var content_bar_top = content_bar.getBoundingClientRect().top 
                        var innerHeight = $window.innerHeight;
                        var last_entry = content_bar.querySelector(".entry.panel-default:nth-last-of-type(1)");
                        if (last_entry 
                                && parseInt($window.getComputedStyle(last_entry, "").height) < (innerHeight - content_bar_top)) {
                            last_entry.style.height = innerHeight - content_bar_top + "px";
                        }
                    },
                    1
                );
            });
        },
    }
});
