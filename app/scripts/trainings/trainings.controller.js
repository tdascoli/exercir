;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('TrainingsCtrl', function ($scope, $sce, $stateParams, $q, Ref, moment, Upload, trainings, collections) {


    $scope.loadTags = function(query) {
      return $q(function(resolve) {

        Ref.child('data/training-content')
          .orderByChild('text')
          .startAt(query)
          .endAt(`${query}\uf8ff`)
          .once('value', function (snap) {
            var records = [];
            snap.forEach(function (ss) {
              records.push(ss.val());
            });
            resolve({data: records});
          });

      });
    };

    $scope.trainings = trainings;
    $scope.collections = collections;
  });

}());
