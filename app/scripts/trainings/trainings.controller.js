;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('TrainingsCtrl', function ($scope, trainings, collections) {
    $scope.trainings = trainings;
    $scope.collections = collections;
  });

}());
