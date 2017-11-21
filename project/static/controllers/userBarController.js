angular.module('myApp').controller('userBarController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
      setUsername = function(username){
          $scope.user = username;
      };

      AuthService.getUsername()
          .then(function(data){
              setUsername(data.data.username);
          });

      $scope.loggedUser = AuthService.isLoggedIn;

      $scope.$on('logStatusChanged', function(event, data) {
          console.log('log status changed to: ', data );
          $scope.loggedUser = data;
      });
}]);