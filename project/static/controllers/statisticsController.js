
angular.module('myApp').controller('statisticsController',  ['$scope', '$location', '$http', '$rootScope', 'AuthService',
    function ($scope, $location, $http, $rootScope, AuthService) {

        setUsername = function(username){
            $scope.user = username;
        };

        AuthService.getUsername()
            .then(function(data){
                setUsername(data.data.username);
            });

    }]);