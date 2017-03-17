'use strict';
angular.module('exercirApp')
  .factory('Organizations', function($firebaseArray, $firebaseObject, Ref){
    var ref = Ref.child('organizations');
    var organizations = $firebaseArray(ref);

    var Organizations = {
      getOrganization: function(organizationid){
        return $firebaseObject(ref.child(organizationid));
      },
      organizations: organizations
    };

    return Organizations;
  });
