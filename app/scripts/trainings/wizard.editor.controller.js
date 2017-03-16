;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('WizardEditorCtrl', function ($scope, $sce, $stateParams, $q, $firebaseArray, Ref, lodash, trainings, exercises) {

    $scope.loadTags = function(query) {
      return $q(function(resolve) {

        Ref.child('data/training-content')
          .orderByChild('text')
          .startAt(query)
          .endAt(query+'\uf8ff')
          .once('value', function (snap) {
            var records = [];
            snap.forEach(function (ss) {
              records.push(ss.val());
            });
            resolve({data: records});
          });

      });
    };

    $scope.exercises = exercises;
    // 3-way binding?
    $scope.trainings = trainings;

    $scope.training = {};
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.trainingId !== undefined) {
      $scope.training = $scope.trainings.$getRecord($stateParams.trainingId);
    }

    // MARKDOWN
    //var converter = new showdown.Converter();
    //var md = new MarkdownIt();
    $scope.showHtmlText = false;
    $scope.showHtml = function () {
      $scope.showHtmlText = !$scope.showHtmlText;
    };
    /*
    $scope.convertToHtml = function (markdown) {
      //return $sce.trustAsHtml(converter.makeHtml(markdown));
      return $sce.trustAsHtml(md.render(markdown));
    };
    */

    // SAVE
    $scope.saveTraining = function () {
      if ($stateParams.trainingId !== undefined) {
        $scope.trainings.$save($scope.training).then(function () {
          console.log('update!');
        }, function(err){
          console.log(err);
        });
      }
      else {
        $scope.trainings.$add($scope.training).then(function () {
          console.log('saved!');
        });
      }
    };
  });

}());
