angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http', '$rootScope',
  function ($q, $timeout, $http, $rootScope) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({    
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus,
      getUsername: getUsername,
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function login(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/login', {email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            user = true;
            username = email;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // notify interested parties that user is logged in
      $rootScope.$broadcast('logStatusChanged', true);

      // return promise object
      return deferred.promise;
    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // notify interested parties that user has logged out
      $rootScope.$broadcast('logStatusChanged', false);

      // return promise object
      return deferred.promise;

    }

    function register(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register', {email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function getUserStatus() {
      return $http.get('/api/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function getUsername(){
        return $http.get('/api/username')
        // handle success
            .success(function (data) {
                user = data.username;
            })
            // handle error
            .error(function (data) {
                user = false;
            });
    }
}]);