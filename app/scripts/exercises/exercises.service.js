'use strict';
angular.module('exercirApp')
  .factory('Exercises', function($firebaseArray, Ref){
    var ref = Ref.child('exercises');
    var exercises = $firebaseArray(ref);

    var Exercises = {
      getUserExercises: function(uid){
        return $firebaseArray(ref.child(uid));
      },
      getExercise: function(uid,exerciseId){
        return $firebaseObject(ref.child(uid).child(exerciseId));
      },
      exercises: exercises
    };

    return Exercises;
  });
