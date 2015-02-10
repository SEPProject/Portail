/**
 * Created by julescantegril on 10/02/2015.
 */
var mainApp = angular.module('mainApp',['ngMaterial']);

mainApp.controller('mainCtrl',function($scope,$mdSidenav){

    $scope.toggleMenu = function(){
        $mdSidenav('left').toggle();
    }

    $scope.connected = false;


});