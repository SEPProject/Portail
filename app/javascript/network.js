/**
 * Created by julescantegril on 26/02/2015.
 */
'use strict';

var network = angular.module('network', ['resourceNetwork']);

network.factory('Applet', ["appConfig",'resourceNetworkFac',function(appConfig,$resource) {
    return $resource(appConfig.path.base+"/applet/:id",{id: "@id"});
}]);

network.factory('User', ["appConfig",'resourceNetworkFac',function(appConfig,$resource) {
    return $resource(appConfig.path.base+"/user",{id: "@id"});
}]);

network.factory('UserAction', ["appConfig",'resourceNetworkFac',function(appConfig,$resource) {
    return $resource("/PortailSep/app/connexionOk.json",{id: "@id"});
}]);

//PortailSep/app/
//appConfig.path.base+"/user/action/:id"

network.factory('Domain', ["appConfig",'resourceNetworkFac',function(appConfig,$resource) {
    return $resource(appConfig.path.base+"/domain/:id",{id: "@id"});
}]);