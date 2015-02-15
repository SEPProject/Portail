/**
 * Created by julescantegril on 10/02/2015.
 */
var mainApp = angular.module('mainApp',['ngMaterial']);

mainApp.controller('mainCtrl',function($scope,$mdSidenav){

    $scope.toggleMenu = function(){
        $mdSidenav('left').toggle();
    }

    $scope.nameProject = 'Security Educational Platform';
    $scope.abreviationProject = 'SEP';

    $scope.login = '';
    $scope.pwd = '';

    $scope.userConnected = false;

    $scope.connect = function(){
        $scope.userConnected = true;
        //$scope.boobs = $scope.login + ' dddddd ' +$scope.pwd;
    };

    $scope.userAndPassPresent = false;
    $scope.userOrPwdChange = function(){
        if($scope.login === '' || $scope.pwd === ''){
            $scope.userAndPassPresent = false;
        }else{
            $scope.userAndPassPresent = true;
        }
    };




});