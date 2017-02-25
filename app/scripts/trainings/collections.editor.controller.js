;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('CollectionsEditorCtrl', function ($scope, $sce, $stateParams, $q, Ref, lodash, collections, exercises) {

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
    $scope.collections = collections;

    $scope.exercise={};
    $scope.editTrainingIndex=false;

    $scope.training = {};
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.collectionId !== undefined) {
      $scope.training = $scope.collections.$getRecord($stateParams.collectionId);
    }


    // SEARCH
    $scope.searchResult=[];

    $scope.$watch('search', function() {
      if ($scope.search!==undefined) {
        $scope.searchTerm();
      }
    }, true);

    function checkExerciseObject(exObj){
      var isInObj=false;
      if (exObj!==undefined) {
        if (checkExerciseString(exObj.name) || checkExerciseString(exObj.description) || checkExerciseContent(exObj.content)) {
          isInObj = true;
        }
      }
      return isInObj;
    }

    function checkExerciseContent(exCon){
      var isInCon=false;
      angular.forEach(exCon, function (value) {
        if (checkExerciseString(lodash.toLower(value.text))){
          isInCon=true;
        }
      });
      return isInCon;
    }

    function checkExerciseString(esStr){
      var isInStr=false;
      angular.forEach($scope.search, function (value) {
        if (lodash.toLower(esStr).indexOf(lodash.toLower(value.text))>=0){
          isInStr=true;
        }
      });
      return isInStr;
    }

    $scope.searchTerm=function () {
      $scope.searchResult = lodash.filter($scope.exercises, function(o) {
        return checkExerciseObject(o);
      });
    };

    $scope.addExercise=function () {
      if ($scope.training.exercises===undefined){
        $scope.training.exercises=[];
      }

      $scope.exercise.content=$scope.search;
      $scope.training.exercises.push($scope.exercise);
      $scope.exercise={};
    };

    $scope.showExercise=function(exerciseId){
      var exercise = lodash.filter($scope.exercises, ['$id', exerciseId]);
      return exercise[0];
    };

    $scope.removeExercise=function(index){
      $scope.training.exercises.splice(index, 1);
      // save?
    };

    $scope.toggleEditExercise=function(index){
      if ($scope.editTrainingIndex===false) {
        $scope.editTrainingIndex = index;
      }
      else if ($scope.editTrainingIndex === index){
        $scope.editTrainingIndex = false;
      }
      else {
        // todo?!
        $scope.editTrainingIndex = index;
        console.log('error - editing?!?');
      }
    };

    $scope.isEdit=function(index){
      return ($scope.editTrainingIndex===index);
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

    // SAVE
    $scope.saveCollection = function () {
      if ($stateParams.collectionId !== undefined) {
        $scope.collections.$save($scope.training).then(function () {
          console.log('update!');
        }, function(err){
          console.log(err);
        });
      }
      else {
        $scope.collections.$add($scope.training).then(function () {
          console.log('saved!');
        });
      }
    };
  });

}());
