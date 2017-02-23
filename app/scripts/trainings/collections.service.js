'use strict';
angular.module('exercirApp')
  .factory('Collections', function($firebaseArray, Ref){
    var ref = Ref.child('collections');
    var collections = $firebaseArray(ref);

    var Collections = {
      getUserCollections: function(uid){
        return $firebaseArray(ref.child(uid));
      },
      getCollections: function(uid,collectionId){
        return $firebaseObject(ref.child(uid).child(collectionId));
      },
      collections: collections
    };

    return Collections;
  });
