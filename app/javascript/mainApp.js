/**
 * Created by julescantegril on 10/02/2015.
 */
'use strict';

var mainApp = angular.module('mainApp',['ngMaterial','ngRoute','ngMessages','ngCookies','network','resourceNetwork']);
var isConnected = false;
var isAdmin = true;

var user = {'id':'','pseudo':'','email':'','token':0};


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
        },
        reference : {
            url : '/references',
            ctrl : 'referencesCtrl',
            file : 'references.html'
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

mainApp.controller('mainCtrl',function($scope,$mdSidenav,$location,$cookieStore,UserAction,$http,$mdBottomSheet){

    $scope.version = "v0.0.1"
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
        var userAction = {};
        //userAction.token = $cookieStore.get('token');
        userAction.id = user.id;
        UserAction.delete(userAction,function(data){
            $scope.login = '';
            $scope.pwd = '';
            user.email = '';
            user.login = '';
            user.token = '';
            $scope.userConnected = false;
            isConnected = false;
            $scope.go('/login');
        },function(err){
            //what do we do in that case ?
        });
       // $cookieStore.remove('token');
    };

    $scope.setLangage = function(lang){
        if(lang === "eng"){//anglais
            $http.get('./langages/eng.json')
                .success(function(data){
                    $scope.jsonLang = data;
                });
        }else{//francais
            $http.get('./langages/fr.json').success(function(data){
                $scope.jsonLang = data;
            });
        }
    };

    $scope.changeLangage = function(){
        if($scope.jsonLang.lang === "fr"){
            $scope.setLangage("eng");
        }else{
            $scope.setLangage("fr");
        }
    };

    $scope.setLangage("fr");

    $scope.showGridBottomSheet = function($event) {
        $mdBottomSheet.show({
            templateUrl: './partials/bottomSheet.html',
            controller: 'bottomSheetCtrl',
            targetEvent: $event
        });
    };

});

mainApp.controller('loginCtrl',function($http,$scope,$location,$cookies,UserAction){

    $scope.login = '';
    $scope.pwd = '';
    $scope.blank = '';

    $scope.userConnected = isConnected;

    $scope.connect = function(){

        user.password = $scope.pwd;
        user.pseudo = $scope.login;
        user.email = $scope.login;

        var userAction = new UserAction;
        userAction.email = user.email;
        userAction.password = user.password;
        userAction.pseudo = user.pseudo;
        userAction.$save(function(data){
            console.log(data);
            $scope.userConnected =  true;
           // $cookies.token = data.token;
            $location.path('/welcome');
            isConnected  = true;
        },function(err){
            console.log(err);
            $scope.userConnected =  true;
            isConnected  = true;
            $location.path('/welcome');
        });
    };

});

mainApp.controller('signinCtrl',function($scope,User,$location){

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

    $scope.signin = function(){
        var userAction = new User;
        userAction.email = $scope.email;
        userAction.pwd = $scope.pwd;
        userAction.pseudo = $scope.pseudo;
        userAction.$save(function(data){
            console.log("data");
            console.log(data);
            user.pseudo =  $scope.pseudo;
            user.email =  $scope.email;
            user.token =  data.token;
            user.id = data.id;
            $location.path('/welcome');
        },function(err){
            console.log("err");
            console.log(err);
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

    $http.get('./domains.json').success(function(data){
        $scope.domains = data;
    });

    $http.get('./applets.json').success(function(data){
        $scope.applets = data;
        for(var i in data)
        {
            data[i].isCollapsed = true;
        }
    });

    var applets = {};
    applets.token = $cookieStore.get('token');
    applets.all = true;
    Applet.get(applets,function(data){
        $scope.applets = data;
    },function(err){

    });

    var domains = {};
    domains.token = $cookieStore.get('token');
    Domain.get(domains,function(data){
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

mainApp.controller('profileCtrl',function($scope,User,$mdDialog){
    $scope.pseudoModify = user.pseudo;
    $scope.emailModify = user.email;
    $scope.passwordModify = '';

    $scope.pwdOk = false;
    $scope.emailOk = false;
    $scope.pseudoOk = false;

    $scope.pwdNotEqual = {};

    var userGet ={};
    userGet.id = user.id;
    //userGet.token = user.token;
    User.get(userGet,function(data){

    },function(err){

    });

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


    $scope.changeInfo = function(ev){

        var userChanged = new User;
        userChanged.idM = 1;
        userChanged.email = $scope.emailModify;
        userChanged.pseudo =  $scope.pseudoModify;
        userChanged.password =  $scope.passwordModify;
        userChanged.id = user.id;
        //userChanged.token = user.token;
        userChanged.$save(function(data){
            user.email =  $scope.emailModify;
            user.pseudo = $scope.pseudo;
            $scope.showModifResult(ev,'Success to change your informations');
        },function(err){
            $scope.showModifResult(ev,'Fail to change your informations');
        });

    };

    $scope.showModifResult = function(ev,result) {
        $mdDialog.show(
            $mdDialog.alert()
                .title('Modification result')
                .content(result)
                .ariaLabel('Password notification')
                .ok('Continue')
                .targetEvent(ev)
        );
    };

});

mainApp.controller('adminUserCtrl',function($scope,User,$cookieStore,UserAction,$http,$mdDialog){

    $scope.showModifResult = function(ev,result,title) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(title)
                .content(result)
                .ariaLabel('Password notification')
                .ok('Ok')
                .targetEvent(ev)
        );
    };

    $scope.deleteUser = function(id,ev){
        var userDel = new User;
        //userDel.token = $cookieStore.get('token');
        //userDel.id = id;
        userDel.id = "123";
        userDel.$remove(function(data){
            $scope.showModifResult(ev,'User deleted','Delete result');
        },function(err){
            $scope.showModifResult(ev,'User not deleted','Delete result');
        });
    };

    $scope.modifyUser = function(user,ev){
        //console.log(user.pseudo+" "+user.email+" "+user.password);
        var userModify = new User;
        userModify.idM = 1;
        userModify.pseudo = user.pseudo;
        userModify.email = user.email;
        userModify.password = user.password;
        userModify.$save(function(data){
            $scope.showModifResult(ev,'User modified','Modification result');
        },function(err){
            $scope.showModifResult(ev,'User modified','Modification result');
        });
    };

    /*var users = new UserAction;
    users.id = user.id;
    users.token = user.token;
    UserAction.get(users,function(data){
        $scope.users = data;
        for(var i in users){
            users[i].expand = false;
        }
    },function(err){

    });*/

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

    $http.get('./users.json').success(function(data){
        $scope.users = data;
    });


});

mainApp.controller('adminAppletsCtrl',function($scope,Applet,Domain,$cookieStore,$http,$mdDialog){

    $scope.showModifResult = function(ev,result,title) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(title)
                .content(result)
                .ariaLabel('Password notification')
                .ok('Ok')
                .targetEvent(ev)
        );
    };


    $http.get('./domains.json').success(function(data){
        $scope.domains = data;
    });

    $http.get('./applets.json').success(function(data){
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
        var applet = new Applet;
        applet.idM = 1;
        applet.token = appletModified.token;
        applet.name = appletModified.name;
        applet.id = appletModified.id;
        applet.duration = appletModified.duration;
        applet.domain = appletModified.domain;
        applet.url = appletModified.url;
        applet.$save(function(data){
            $scope.showModifResult(ev,'Applet modified','Modification result');
        },function(err){
            $scope.showModifResult(ev,'Applet not modified','Modification result');
        });
    }

    $scope.deleteApplet = function(id){
        var applet = new Applet;
        applet.token = $cookieStore.get('token');
        applet.id = id;

        applet.$remove(function(data){
            var nouveauxApplets = [{}];
            for(var i in $scope.applets){
                if(! ($scope.applets[i].id == id.id)){
                    nouveauxApplets.push($scope.applets[i]);
                }
            }
            $scope.showModifResult(ev,'Applet deleted','Delete result');
            $scope.applets = nouveauxApplets;
        },function(err){
            $scope.showModifResult(ev,'Applet not deleted','Delete result');
        });
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

mainApp.controller('referencesCtrl',function($scope,$http) {

    if($scope.jsonLang.lang === "fr"){
        $http.get('./json/referencesFr.json')
            .success(function(data){
                $scope.references = data;
                for(var i in $scope.references){
                    $scope.references[i].expand=false;
                }

            });
    }else{
        $http.get('./json/referencesEng.json')
            .success(function(data){
                $scope.references = data;
                for(var i in $scope.references){
                    $scope.references[i].expand=false;
                }

            });
    }



});

mainApp.controller('bottomSheetCtrl',function($scope) {

});