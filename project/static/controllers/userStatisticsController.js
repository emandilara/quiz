
angular.module('myApp').controller('userStatisticsController',  ['$scope', '$location', '$http', '$rootScope', 'AuthService',
    function ($scope, $location, $http, $rootScope, AuthService) {
        // $http.get('api/userStatistics')
        //     .then(function onSuccess(response) {
        //         var data = response.data.statistics;
        //         var statistics = [];
        //         for(i=0;i<data.length;i++){
        //             entry = {
        //                 name: data[i][0],
        //                 data: [data[i][1]],
        //                 timestamp: [data[i][2]]
        //             };
        //             console.log(entry);
        //             statistics.push(entry)
        //         }
        //         renderUserStatistics('allStatisticsContainer', statistics);
        //     })
        //     .catch(function onError(response) {
        //         console.log('Could not fetch statistics...');
        //     });

                 renderUserStatistics('userStatisticsContainer');
    }]);