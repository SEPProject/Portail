/**
 * Created by julescantegril on 06/02/2015.
 */
var watchController = angular.module('watchController',[]);

watchController.controller('watchCtrl',function($scope,$http,$location){

    $http.get('watch.json').success(function(data){
        $scope.phones = data;
    });

    $scope.go = function (path) {
        $location.path( path );
    };
});