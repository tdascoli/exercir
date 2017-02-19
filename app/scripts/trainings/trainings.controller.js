;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('TrainingsCtrl', function ($scope, $sce, $stateParams, $q, Ref, moment, Upload, trainings) {


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

    $scope.training = {};
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.trainingId !== undefined) {
      $scope.training = $scope.trainings.$getRecord($stateParams.trainingId);
    }

    // MARKDOWN
    var converter = new showdown.Converter();
    $scope.showHtmlText = false;
    $scope.showHtml = function () {
      $scope.showHtmlText = !$scope.showHtmlText;
    };

    $scope.convertToHtml = function (markdown) {
      return $sce.trustAsHtml(converter.makeHtml(markdown));
    };

    $scope.trainingDate=function(){
      return moment($scope.training.trainingDate).format('X');
    };

    // SAVE
    $scope.saveTraining = function () {
      //$scope.training.trainingDate=$scope.trainingDate();
      if ($stateParams.trainingId !== undefined) {
        $scope.trainings.$save($scope.training).then(function () {
          console.log('update!');
        });
      }
      else {
        $scope.trainings.$add($scope.training).then(function () {
          console.log('saved');
        });
      }
    };
  });

}());
