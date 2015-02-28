/**
 * Created by julescantegril on 10/02/2015.
 */
'use strict';

var mainApp = angular.module('mainApp',['ngMaterial','ngRoute','ngMessages','ngCookies','network','resourceNetwork']);
var isConnected = false;
var isAdmin = true;

var user = {'pseudo':'','email':'','token':0};


mainApp.constant("appConfig",{
    path : {base : "http://localhost:3000"},
    routes : {
        baseUrl : 'partials/',
        signin : {
            url : '/signin',
            ctrl : 'signinCtrl',
            file : 'signin.html'
        },
        login : {
            url : '/login',
            ctrl : 'loginCtrl',
            file : 'login.html'
        },
        welcome : {
            url : '/welcome',
            ctrl : 'welcomeCtrl',
            file : 'welcome.html'
        },
        profile :{
            url : '/profile',
            ctrl : 'profileCtrl',
            file : 'profile.html'
        },
        chatSystem : {
            url : '/chatSystem',
            ctrl : 'profileCtrl',
            file : 'chatSystem.html'
        },
        applet : {
            url : '/applets',
            ctrl : 'appletCtrl',
            file : 'applets.html'
        },
        adminUser : {
            url : '/adminUser',
            ctrl : 'adminUserCtrl',
            file : 'adminuser.html'
        },
        adminApplet : {
            url : '/adminApplets',
            ctrl : 'adminAppletsCtrl',
            file : 'adminapplets.html'
        }
    }

});

mainApp.config(['$routeProvider','appConfig',function($routeProvider,appConfig){

    for(var i in appConfig.routes){
        var route = appConfig.routes[i];
        $routeProvider.when(route.url,{
            templateUrl: appConfig.routes.baseUrl+route.file,
            controller: route.ctrl
        });
    }
}]);

mainApp.controller('mainCtrl',function($scope,$mdSidenav,$location,$cookieStore,UserAction){

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

    $scope.deconnect = function(){
        $scope.login = '';
        $scope.pwd = '';
        user.email = '';
        user.login = '';
        user.token = '';
        $scope.userConnected = false;
        isConnected = false;
        $scope.go('/login');
        var userAction = UserAction;
        userAction.token = $cookieStore.get('token');
        userAction.delete();
        $cookieStore.remove('token');
    };

});

mainApp.controller('loginCtrl',function($http,$scope,$location,$cookies,UserAction){

    $scope.go = function(path){
        $location.path(path);
    }

    $scope.login = '';
    $scope.pwd = '';
    $scope.blank = '';

    $scope.userConnected = isConnected;

    $scope.connect = function(){

        user.password = $scope.pwd;
        user.pseudo = $scope.login;
        user.email = $scope.login;

        var userAction = UserAction;
        userAction.email = user.email;
        userAction.password = user.password;
        userAction.pseudo = user.pseudo;
        userAction.save(function(data){
            console.log(data);
            $scope.userConnected =  true;
           // $cookies.token = data.token;
            $location.path('/welcome');
            isConnected  = true;
        },function(err){
            console.log(err);
            $scope.userConnected =  true;
            isConnected  = true;
        });
    };

});

mainApp.controller('signinCtrl',function($scope,User){

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
        var userAction = new User;
        userAction.email = $scope.email;
        userAction.pwd = $scope.pwd;
        userAction.pseudo = $scope.pseudo;
        userAction.$save(function(data){
            user.pseudo =  $scope.pseudo;
            user.email =  $scope.email;
            user.token =  data.token;
        },function(err){

        });
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

mainApp.controller('appletCtrl',function($scope,$http,$window,Applet,Domain,$cookieStore){
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

    var applets = new Applet;
    applets.token = $cookieStore.get('token');
    applets.all = true;
    applets.$save(function(data){
        $scope.applets = data;
    },function(err){

    });

    var domains = new Domain;
    domains.token = $cookieStore.get('token');
    domains.$save(function(data){
        $scope.domains = data;
    },function(err){

    });

    $scope.openDl = function(url){
        $window.open('applets/'+url+'.jar','Download');
    }

    $scope.goWindow = function(url){
        $window.open(url);
    }

});

mainApp.controller('profileCtrl',function($scope,User){
    $scope.pseudoModify = user.pseudo;
    $scope.emailModify = user.email;
    $scope.passwordModify = '';

    $scope.pwdOk = false;
    $scope.emailOk = false;
    $scope.pseudoOk = false;

    $scope.pwdNotEqual = {};



    $scope.checkPwds = function(){
        if($scope.pwd === $scope.passwordModify){
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

        var user = new User.get({id: 1});
        user.email = $scope.emailModify;
        user.pseudo =  $scope.pseudoModify;
        user.password =  $scope.passwordModify;
        user.$save();

    };

});

mainApp.controller('adminUserCtrl',function($scope,User,$cookieStore,UserAction,$http){

    $scope.deleteUser = function(id){
        var user = new User;
        user.token = $cookieStore.get('token');
        user.id = id;
        user.delete();
    };

    $scope.modifyUser = function(user){
        //console.log(user.pseudo+" "+user.email+" "+user.password);
        var userModify = new User({id: 1});
        userModify.pseudo = user.pseudo;
        userModify.email = user.email;
        userModify.password = user.password;
        userModify.$save();
    };

    $scope.getUsers = function(){
        var users = new UserAction;
        users.$save(function(data){
            $scope.users = data;
            for(i in users){
                users[i].expand = false;
            }
        },function(err){

        });
    };


    $scope.emailOk = true;
    $scope.pseudoOk = true;

    $scope.checkPseudo = function(){
        //ask the server is the email is taken or not
        if($scope.signinForm.pseudo.$error.required){
            $scope.pseudoOk = false;
        }else{
            $scope.pseudoOk = true;
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

    $http.get('/PortailSep/app/users.json').success(function(data){
        $scope.users = data;
    });


});

mainApp.controller('adminAppletsCtrl',function($scope,Applet,Domain,$cookieStore,$http){


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

    $scope.getApplets = function(){
     var applet = new Applet;
        applet.$save(function(data){
            $scope.applets = data;
        },function(err){

        });
    };

    $scope.getDomains = function(){
        var domain = new Domain;
        domain.$save(function(data){
            $scope.domains = data;
        },function(err){

        });
    };

    $scope.modifyApplet = function(appletModified){
        var applet = new Applet({id :1});
        applet.token = appletModified.token;
        applet.name = appletModified.name;
        applet.id = appletModified.id;
        applet.duration = appletModified.duration;
        applet.domain = appletModified.domain;
        applet.url = appletModified.url;
        applet.$save();
    }

    $scope.deleteApplet = function(id){
        var applet = new Applet;
        applet.token = $cookieStore.get('token');
        applet.id = id;

        var nouveauxApplets = [{}];
        for(var i in $scope.applets){
            if(! ($scope.applets[i].id == id.id)){
                console.log("if " +$scope.applets[i].id);
                nouveauxApplets.push($scope.applets[i]);
            }else{
                console.log("else "+$scope.applets[i].id);
                delete $scope.applets[i];
            }
        }
        $scope.applets = nouveauxApplets;
        console.log(nouveauxApplets);
        console.log(id);

        /*applet.delete(function(data){
            var nouveauxApplets = [{}];
            for(var i in $scope.applets){
                if(! ($scope.applets[i].id == id)){
                    nouveauxApplets.push($scope.applets[i]);
                }else{
                    delete $scope.applets[i];
                }
            }
        },function(err){
        });*/
    }

    $scope.newApplet = function(domain){
        var nouvelleApplet = {'isCollapsed':true,'domain':domain,'description':'desciption','name':'name','duration':'duration'};

        var applet = new Applet();
        applet.token = nouvelleApplet.token;
        applet.name = nouvelleApplet.name;
        applet.duration = nouvelleApplet.duration;
        applet.domain = nouvelleApplet.domain;
        applet.url = nouvelleApplet.url;
        applet.$save(function(data){
            $scope.applets.push(nouvelleApplet);
        },function(err){

        });

        console.log($scope.applets);
    }




});