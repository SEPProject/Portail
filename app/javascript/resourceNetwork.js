'use strict';

var resourceNetwork = angular.module( 'resourceNetwork', [ 'ngResource' ] );

resourceNetwork.factory( 'resourceNetworkFac', [ '$resource', function( $resource ) {
    return function( url, params, methods ) {
        var defaults = {
            update: { method: 'put', isArray: false },
            create: { method: 'post' }
        };

        methods = angular.extend( defaults, methods );

        var resource = $resource( url, params, methods );
        resource.prototype.$save = function(success, error) {

            var current = angular.copy(this);

            console.log(console.log(JSON.parse(JSON.stringify(current))));
            if ( !current.idM ) {
                console.log("create");
                return current.$create(success, error);
            }
            else {
                console.log("update");
                return current.$update(success, error);
            }
        };

   return resource;
    };
 }]);