/**
 * Created by julescantegril on 06/02/2015.
 */
var watchController = angular.module('watchController',[]);

watchController.controller('watchCtrl',function($scope,$http,$location){

    $http.get('watch.json').success(function(data){
        $scope.phones = data;
    });

    $http.get('https://docs.angularjs.org/tutorial/step_08').success(function(data){
       $scope.test = data;
    });

    $scope.go = function (path) {
        $location.path( path );
    };
    $scope.buttonName ='Phone';
});