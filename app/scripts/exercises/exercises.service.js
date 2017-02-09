'use strict';
angular.module('exercirApp')
  .factory('Exercises', function($firebaseArray, Ref){
    var ref = Ref.child('exercises');
    var exercises = $firebaseArray(ref);

    return exercises;
  });
