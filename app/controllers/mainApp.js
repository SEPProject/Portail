/**
 * Created by julescantegril on 10/02/2015.
 */
var mainApp = angular.module('mainApp',['ngMaterial','ngRoute','ngMessages']);
var isConnected = false;

var user = {'login':'','token':0};

mainApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/signin',{
        templateUrl:'signin.html',
        controller:'signinCtrl'
    }).when('/login',{
        templateUrl:'login.html',
        controller:'loginCtrl'
    });
}]);

mainApp.controller('mainCtrl',function($scope,$mdSidenav){

    $scope.toggleMenu = function(){
        $mdSidenav('left').toggle();
        $scope.userConnected = isConnected;
    };

    $scope.nameProject = 'Security Educational Platform';
    $scope.abreviationProject = 'SEP';

    $scope.userConnected = isConnected;

});

mainApp.controller('loginCtrl',function($scope,$location){
    $scope.login = '';
    $scope.pwd = '';

    $scope.userConnected = isConnected;

    $scope.connect = function(){
        isConnected  = true;
        $scope.userConnected = isConnected;
        user.login = $scope.login;
        //$location.path('/signin');
    };

    $scope.deconnect = function(){
        $scope.login = '';
        $scope.pwd = '';
        $scope.userOrPwdChange();
        $scope.userConnected = false;
    };

    $scope.userAndPassPresent = false;
    $scope.userOrPwdChange = function(){
        if($scope.login === '' || $scope.pwd === ''){
            $scope.userAndPassPresent = false;
        }else{
            $scope.userAndPassPresent = true;
        }
    };

    $scope.go = function(path){
        $location.path(path);
    }

});

mainApp.controller('signinCtrl',function($scope){

    $scope.email = '';
    $scope.pwd = '';
    $scope.pwd2 = '';

    $scope.pwdOk = false;
    $scope.emailOk = false;
    $scope.pseudoOk = false;

    $scope.pwdNotEqual = {};

    $scope.checkPwds = function(){
        if($scope.pwd === $scope.pwd2){
            $scope.pwdOk = true;
            $scope.pwdNotEqual = {};
        }else{
            if(!$scope.signinForm.pwd2.$error.required){
                $scope.pwdNotEqual = {"notEqual":true};
            }else{
                $scope.pwdNotEqual = {};
            }
            $scope.pwdOk = false;
        }
    };

    $scope.checkEmail = function(){
        //ask the server is the email is taken or not
        if($scope.signinForm.email.$error.email || $scope.signinForm.email.$error.required){
            $scope.emailOk = false;
        }else{
            $scope.emailOk = true;
        }
    };

    $scope.singin = function(){
        //jsute sign in if every thing is OK
    };

    $scope.checkPseudo = function(){
        //ask the server is the email is taken or not
        if($scope.signinForm.pseudo.$error.required){
            $scope.pseudoOk = false;
        }else{
            $scope.pseudoOk = true;
        }
    }

});