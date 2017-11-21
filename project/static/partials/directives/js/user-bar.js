myApp.directive("userBar", function() {
    return {
        restrict: 'AE',
        templateUrl: 'static/partials/directives/templates/user-bar.html',
        controller: 'userBarController'
    }
});
