/**
 * Created by julescantegril on 06/02/2015.
 */

var phoneController = angular.module('phoneController',[]);

phoneController.controller('listCtrl',function($scope,$http,$location){

    $http.get('my.json').success(function(data){
       $scope.phones = data;
    });

    $scope.go = function(path){
        $location.path(path);
    };
});