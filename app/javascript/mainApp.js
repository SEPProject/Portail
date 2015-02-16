/**
 * Created by julescantegril on 10/02/2015.
 */
var mainApp = angular.module('mainApp',['ngMaterial','ngRoute','ngMessages']);
var isConnected = false;

var user = {'pseudo':'','email':'','token':0};

mainApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/signin',{
        templateUrl:'signin.html',
        controller:'signinCtrl'
    }).when('/login',{
        templateUrl:'login.html',
        controller:'loginCtrl'
    }).when('/welcome',{
            templateUrl:'welcome.html',
            controller:'welcomeCtrl'
        }).when('/applets',{
        templateUrl:'applets.html',
        controller:'appletCtrl'
    }).when('/profile',{
        templateUrl:'profile.html',
        controller:'profileCtrl'
    });
}]);

mainApp.controller('mainCtrl',function($scope,$mdSidenav,$location){

    $scope.toggleMenu = function(){
        if(isConnected){
            $mdSidenav('left').toggle();
        }else{
            $scope.go('/login');
        }
        $scope.userConnected = isConnected;
    };

    $scope.nameProject = 'Security Educational Platform';
    $scope.abreviationProject = 'SEP';

    $scope.userConnected = isConnected;

    $scope.go = function(path){
        $location.path(path);
    }

});

mainApp.controller('loginCtrl',function($scope,$location){

    $scope.go = function(path){
        $location.path(path);
    }

    $scope.login = '';
    $scope.pwd = '';

    $scope.userConnected = isConnected;

    $scope.connect = function(){
        isConnected  = true;
        $scope.userConnected = isConnected;
        user.pseudo = $scope.login;
        $location.path('/welcome');
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

mainApp.controller('welcomeCtrl',function($scope){
    $scope.pseudo = user.pseudo;
});

mainApp.controller('appletCtrl',function($scope,$http){
    $scope.selectedTab = 0;
    $scope.isConnected = isConnected;
    $http.get('/PortailSep/app/domains.json').success(function(data){
        $scope.domains = data;
    });

    $http.get('/PortailSep/app/applets.json').success(function(data){
        $scope.applets = data;
        for(var i in data)
        {
            data[i].isCollapsed = true;
        }
    });


});

mainApp.controller('profileCtrl',function($scope){
    $scope.pseudo = user.pseudo;
    $scope.email = user.email;

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

    $scope.changeInfo = function(){

    };

});