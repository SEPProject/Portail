var phoneApp = angular.module('phoneApp',[]);

phoneApp.controller('PhoneListCtrl', function($scope){

  $scope.phones = [

    {'nom':'Jules','marque':'wiko'},
    {'nom':'Mat','marque':'samsung'}
  ];


});

phoneApp.controller('mainCtrl', function($scope,$http){
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

});

phoneApp.controller('PhoneListCtrl2', function($scope){

  $scope.phones = [

    {'nom':'Jules2','marque':'wiko2'},
    {'nom':'Mat2','marque':'samsung2'}
  ];

});