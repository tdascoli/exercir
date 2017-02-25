'use strict';
angular.module('exercirApp')
  .factory('Trainings', function($firebaseArray, $firebaseObject, Ref){
    var ref = Ref.child('trainings');
    var trainings = $firebaseArray(ref);

    var Trainings = {
      getUserTrainings: function(uid){
        return $firebaseArray(ref.child(uid));
      },
      getTrainings: function(uid,trainingId){
        return $firebaseObject(ref.child(uid).child(trainingId));
      },
      trainings: trainings
    };

    return Trainings;
  });
