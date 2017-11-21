var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'static/partials/home.html',
      controller: 'quizController',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'static/partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'static/partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/user-statistics', {
      templateUrl: 'static/partials/user-statistics1.html',
      controller: 'userStatisticsController',
      access: {restricted: false}
    })
    .when('/all-time-statistics', {
      templateUrl: 'static/partials/all-statistics.html',
      controller: 'allStatisticsController',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});