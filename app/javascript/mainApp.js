/**
 * Created by julescantegril on 10/02/2015.
 */
'use strict';

var mainApp = angular.module('mainApp',['ngMaterial','ngRoute','ngMessages','ngCookies','network','resourceNetwork']);
var isConnected = false;
var isAdmin = false;

var jsonLang;

var user = {'pseudo':'','email':'','token':0};

var currentLang = "";

mainApp.constant("appConfig",{
    path : {base : "http://81.255.175.90:3000"},
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

mainApp.controller('mainCtrl',function($mdDialog,$scope,$mdSidenav,$location,$cookieStore,UserAction,$http,$mdBottomSheet,User){

    $scope.pseudo = user.pseudo;

    $scope.displayMessage = function(title,content,button){
        $mdDialog.show(
            $mdDialog.alert()
                .title(title)
                .content(content)
                .ariaLabel('')
                .ok(button)
                .targetEvent()
        );
    }

    user.token =  $cookieStore.get('token');
    $scope.isAdmin = isAdmin;

    console.log('token ask '+ user.token);
    if(user.token == 0 || 'undefined' == typeof user.token) {
        isConnected = false;
        isAdmin = false;
    }else{
        var userGet ={};
        // userGet.id = user.id;
        userGet.token = user.token;
        User.query(userGet,function(data){
            isConnected = true;
            if(user.token == 1){
                isAdmin = true;
            }
            user.email = data[0].email;
            user.pseudo = data[0].login;
            $scope.pseudo = user.pseudo;
            console.log(isAdmin+'li '+JSON.stringify(data));
            isAdmin = data.admin;
        },function(err){
           // console.log('la');
            isConnected = false;
            isAdmin = false;
            if(err.status == 406){
                $scope.displayMessage(jsonLang.reconnectTitle,jsonLang.reconnectContent,'ok');
                $scope.deconnect();
            }
        });
    }

    $scope.toggleMenu = function(){
        if(isConnected){
            $mdSidenav('left').toggle();
        }else{
            $scope.go('/login');
        }
        $scope.userConnected = isConnected;
    };

    $scope.nameProject = 'Security Educational Platform';
    //$scope.nameProject = CryptoJS.MD5('').toString();
    $scope.abreviationProject = "SEP";

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
        userAction.token = $cookieStore.get('token');
       // userAction.id = user.id;
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
        $cookieStore.remove('token');
    };

    $scope.setLangage = function(lang){
        if(lang === "eng"){//anglais
            $http.get('./langages/eng.json')
                .success(function(data){
                    $scope.jsonLang = data;
                    jsonLang = data;
                });
        }else{//francais
            $http.get('./langages/fr.json').success(function(data){
                $scope.jsonLang = data;
                jsonLang = data;
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

    $scope.setUser = function(data){
        $scope.pseudo = data;
    }

});

mainApp.controller('loginCtrl',function($http,$scope,$location,$cookies,UserAction,$mdDialog){

    $scope.login = '';
    $scope.pwd = '';
    $scope.blank = '';

    $scope.userConnected = isConnected;

    $scope.connect = function(ev){

        user.pseudo = $scope.login;
        user.email = $scope.login;
        user.passwordhashed = $scope.pwd;

        var userAction = new UserAction;
        userAction.login = user.pseudo;
        userAction.email = user.email;
        userAction.passwordhashed = CryptoJS.MD5(user.passwordhashed).toString();
        userAction.$save(function(data){
            console.log(data);
           // console.log("id"+data.id+" token "+data.token);
           // user.id = data.id;
            user.token = data.token;
            isAdmin = data.admin;
            $scope.$parent.isAdmin = isAdmin;
            $scope.userConnected =  true;
            $cookies.token = data.token;
            $location.path('/welcome');
            console.log(isAdmin+'la '+JSON.stringify(data));
            isConnected  = true;
        },function(err){
            console.log(err);
            //$scope.userConnected =  true;
           // isConnected  = true;
          //  $location.path('/welcome');

            if(err.status == 400){
                $scope.showErrorSignIn(ev,jsonLang.pbSignIn);
            }else{
                $scope.showErrorSignIn(ev,jsonLang.pbServeur);
            }

        });
    };

    $scope.showErrorSignIn = function(ev,result) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(jsonLang.loginResult)
                .content(result)
                .ariaLabel('')
                .ok('Ok')
                .targetEvent(ev)
        );
    };


});

mainApp.controller('signinCtrl',function($scope,User,$location,$mdDialog,$cookies,$route){

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

    $scope.signin = function(ev){
        var userAction = new User;
        userAction.email = $scope.email;
        userAction.login = $scope.pseudoS;
        userAction.passwordhashed = CryptoJS.MD5($scope.pwd).toString();
        userAction.$save(function(data){
           // console.log("data");
           // console.log(data);
            user.pseudo =  $scope.pseudoS;
           // $scope.pseudo = user.pseudo;
            user.email =  $scope.email;
            user.token =  data.token;
            $cookies.token = data.token;
            // user.id = data.id;
            console.log(user.pseudo+" token "+user.token);
            $scope.userConnected =  true;
            isConnected  = true;
            $location.path('/welcome');
           // $route.reload();
            $scope.setUser(user.pseudo);
        },function(err){
            if(err.status == 400){
                $scope.showErrorSignIn(ev,jsonLang.pbSignIn);
            }else if(err.status == 500){
                $scope.showErrorSignIn(ev,jsonLang.pbServeur);
            }else if(err.status == 410){
                $scope.showErrorSignIn(ev,jsonLang.pbLoginExist);
            }
        });
    };

    $scope.checkPseudo = function(){
        //ask the server is the email is taken or not
        if($scope.signinForm.pseudoS.$error.required){
            $scope.pseudoOk = false;
        }else{
            $scope.pseudoOk = true;
        }
    }

    $scope.showErrorSignIn = function(ev,result) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(jsonLang.signInResult)
                .content(result)
                .ariaLabel('Sign in notification')
                .ok('Ok')
                .targetEvent(ev)
        );
    };

});

mainApp.controller('welcomeCtrl',function($scope,$http){

    if($scope.jsonLang.lang === "fr"){
        $http.get('./json/welcomeFr.json')
            .success(function(data){
                $scope.welcome = data;
                for(var i in $scope.welcome){
                    $scope.welcome[i].expand=false;
                }

            });
    }else{
        $http.get('./json/welcomeEng.json')
            .success(function(data){
                $scope.welcome = data;
                for(var i in $scope.welcome){
                    $scope.welcome[i].expand=false;
                }

            });
    }

});

mainApp.controller('appletCtrl',function($scope,$http,$window,Applet,Domain,$cookieStore){
    $scope.selectedTab = 0;
    $scope.isConnected = isConnected;
/*
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
*/
    var applets = {};
    applets.token = $cookieStore.get('token');
    applets.all = true;
    Applet.query(applets,function(data){

        console.log("APPLETS"+JSON.stringify(data));
        $scope.applets = JSON.parse(JSON.stringify(data));
        for(var i in $scope.applets)
        {
            $scope.applets[i].isCollapsed = true;
        }
        console.log(JSON.stringify($scope.applets));
    },function(err){

    });

    var domains = {};
    domains.token = $cookieStore.get('token');
    Domain.query(domains,function(data){
        $scope.domains = data;
        console.log(JSON.stringify($scope.domains));
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
   // userGet.id = user.id;
    userGet.token = user.token;
    User.query(userGet,function(data){
        user.email = data[0].email;
        user.pseudo = data[0].login;
        $scope.pseudoModify = user.pseudo;
        $scope.emailModify = user.email;
    },function(err){
        if(err.status == 406){
            $scope.displayMessage(jsonLang.reconnectTitle,jsonLang.reconnectContent,'ok');
            $scope.deconnect();
        }
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

    $scope.oldPwd  = '';
    $scope.changeInfo = function(ev){
       // console.log("UYSER "+user.id);
       // $scope.userId = user.id;
        var userChanged = new User;
        userChanged.idM = 1;
        userChanged.login =  $scope.pseudoModify;
        userChanged.email = $scope.emailModify;
        if(!($scope.oldPwd === '')){
            userChanged.passwordhashed = CryptoJS.MD5($scope.passwordModify).toString();
            userChanged.passwordhashedold = CryptoJS.MD5($scope.oldPwd).toString();
        }
       // userChanged.id = user.id; //plus besoin de l'id avec le token
        userChanged.token = user.token;
        userChanged.$save(function(data){
            user.email =  $scope.emailModify;
            user.pseudo = $scope.pseudoModify;
            $scope.showModifResult(ev,jsonLang.successChangeInfo);
        },function(err){
            if(err.status == 401){
                $scope.displayMessage(badPwd,badPwdContent,'ok');
            }else{
                $scope.showModifResult(ev,jsonLang.failChangeInfo);
            }
        });

    };

    $scope.actionDel = function(ev){
        // console.log("UYSER "+user.id);
        // $scope.userId = user.id;
        console.log("okokookkokoko");
        var userToDel = new User;

        userToDel.token = user.token;
        userToDel.$remove(function(data){
            $scope.showDeleteResult(ev,jsonLang.successDelete);
            $scope.deconnect();
        },function(err){
            $scope.showDeleteResult(ev,jsonLang.failDelete);
        });
        $scope.closeDialog();
    };

    $scope.showModifResult = function(ev,result) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(jsonLang.modificationResult)
                .content(result)
                .ariaLabel(jsonLang.passwordNotif)
                .ok(jsonLang.continue)
                .targetEvent(ev)
        );
    };

    $scope.showDeleteResult = function(ev,result) {
        $mdDialog.show(
            $mdDialog.alert()
                .title(jsonLang.resultDelete)
                .content(result)
                .ok(jsonLang.continue)
                .targetEvent(ev)
        );
    };

    $scope.jsonLang = jsonLang;

    $scope.delUser = function(ev){
        $mdDialog.show({
            targetEvent: ev,
            template:
            '<md-dialog>' +
            '  <md-dialog-content style="margin-top: 5%;" layout="center center" layout-align="center center">{{jsonLang.confirmDelete}}</md-dialog-content>' +
            '  <div class="md-actions">' +
            '    <md-button ng-click="actionDel(ev)" class="md-raised md-warn">' +
            '      {{jsonLang.deleteAccount}}' +
            '    </md-button>' +
            '    <md-button ng-click="closeDialog()" class="md-primary">' +
            '       {{jsonLang.cancel}}' +
            '    </md-button>' +
            '  </div>' +
            '</md-dialog>',
            controller: 'profileCtrl',
            onComplete: afterShowAnimation,
            locals: { employee: $scope.userName }
        });
    };

    $scope.closeDialog = function() {
        $mdDialog.hide();
    };

    function afterShowAnimation() {

    }

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
        userDel.token = $cookieStore.get('token');
        //userDel.id = id;
       // userDel.id = "123";
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
            var nouveauxApplets = [];
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

    $scope.version = "v1.0.0"

    $scope.items = [
        { name: 'Contact', icon: '/home/insa/Portail/app/bower_components/material-design-icons/notification/svg/design/ic_sms_24px.svg' },
        { name: $scope.version, icon: '' }
    ];

    $scope.messages ='';

    $scope.changeMessage = function(index){
        if(index == 0){
            $scope.messages = jsonLang.bottomContact;
        }else if(index == 1){
            $scope.messages = jsonLang.bottomVersion;
        }
    };

});
