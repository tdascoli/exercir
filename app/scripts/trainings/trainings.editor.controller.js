;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('TrainingsEditorCtrl', function ($scope, $sce, $stateParams, $q, Ref, moment, lodash, Upload, trainings, exercises) {


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

    $scope.exercises = exercises;
    $scope.trainings = trainings;

    $scope.exercise={};
    $scope.training = {};
    $scope.trainingExercises=[];
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.trainingId !== undefined) {
      $scope.training = $scope.trainings.$getRecord($stateParams.trainingId);
    }


    // SEARCH
    $scope.searchResult=$scope.exercises;

    $scope.addExercise=function () {
      if ($scope.training.exercises===undefined){
        $scope.training.exercises=[];
      }
      var exercise = lodash.filter($scope.exercises, ['$id', $scope.exercise.exerciseId]);

      $scope.exercise.description=exercise[0].description;
      $scope.exercise.coaching=exercise[0].coaching;
      $scope.exercise.aufbau=exercise[0].aufbau;
      $scope.exercise.name=exercise[0].name;
      $scope.exercise.variationen=exercise[0].variationen;
      $scope.exercise.graphic=exercise[0].graphic;

      $scope.training.exercises.push($scope.exercise);
      $scope.exercise={};
    };

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
      console.log($scope.training);
      //$scope.training.trainingDate=$scope.trainingDate();
      if ($stateParams.trainingId !== undefined) {
        $scope.trainings.$save($scope.training).then(function () {
          console.log('update!');
        });
      }
      else {
        $scope.trainings.$add($scope.training).then(function () {
          console.log('saved!');
        });
      }
    };
  });

  angular.module('exercirApp')
    .filter('searchFilter', function($filter){
    return function(items, text){
      if (!text || text.length === 0) {
        return items;
      }

      // split search text
      var searchTerms=[];
      angular.forEach(text, function(value){
        searchTerms.push(value.text);
      });


      // search for single terms.
      // this reduces the item list step by step
      searchTerms.forEach(function(term) {
        if (term && term.length) {
          items = $filter('filter')(items, term);
        }
      });

      return items;
    };
  });

}());
