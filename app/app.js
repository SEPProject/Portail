
var phoneApp = angular.module('phoneApp',['ngMaterial','ngRoute','phoneController','watchController']);

phoneApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/bobe',{
        templateUrl:'phone.html',
        controller:'listCtrl'
    }).when('/bob',{
        templateUrl:'watch.html',
        controller:'watchCtrl'
    });
}]);

phoneApp.controller('sideNavCtrl', function($scope,$mdSidenav){

    $scope.toggleRightSide = function(){
        $mdSidenav('left').toggle();
    };

});

phoneApp.controller('PhoneListCtrl', function($scope){

  $scope.phones = [

    {'nom':'Jules','marque':'wiko'},
    {'nom':'Mat','marque':'samsung'}
  ];


});

phoneApp.controller('mainCtrl', function($scope,$http,$location){
  $http.get('my.json').success(function(data){
    $scope.phones = data;
  });
  $scope.accueilWord = 'Page daccueil';

  $scope.trieur = 'nom';


  /* $scope.phones = [

     {'nom':'Jules3','marque':'wiko3'},
     {'nom':'jardoul','marque':'samsung3'},
     {'nom':'Mat3','marque':'samsung3'},
     {'nom':'marine','marque':'samsung3'},
     {'nom':'matthieu','marque':'samsung3'},
     {'nom':'ramonville','marque':'samsung3'}
   ];*/

    $scope.go = function(path){
        $location.path(path);
    }

});

phoneApp.controller('PhoneListCtrl2', function($scope){

  $scope.phones = [

    {'nom':'Jules2','marque':'wiko2'},
    {'nom':'Mat2','marque':'samsung2'}
  ];

});