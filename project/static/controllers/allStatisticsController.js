
angular.module('myApp').controller('allStatisticsController',  ['$scope', '$location', '$http', '$rootScope', 'AuthService',
    function ($scope, $location, $http, $rootScope, AuthService) {
        $http.get('api/statistics')
            .then(function onSuccess(response) {
                var data = response.data.statistics;
                var statistics = [];
                for(i=0;i<data.length;i++){
                    entry = {
                        name: data[i][0],
                        data: [data[i][1]]
                    };
                    statistics.push(entry)
                }
                renderAllStatistics('allStatisticsContainer', statistics);
            })
            .catch(function onError(response) {
                console.log('Could not fetch statistics...');
            });

    }]);