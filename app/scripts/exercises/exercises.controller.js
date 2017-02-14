'use strict';

angular.module('exercirApp')
  .controller('ExercisesCtrl', function ($scope, $http, $sce, $stateParams, $timeout, Upload, exercises) {
    $scope.loadTags = function(query) {
      return $http.get('assets/json/tags.json');
    };

    $scope.exercises=exercises;

    $scope.exercise={};
    $scope.exercise.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.exerciseId!==undefined){
      $scope.exercise = $scope.exercises.$getRecord($stateParams.exerciseId);
    }

    // MARKDOWN
    var converter = new showdown.Converter();
    $scope.showHtmlText=false;
    $scope.showHtml=function(){
      $scope.showHtmlText=!$scope.showHtmlText;
    };

    $scope.convertToHtml = function(markdown){
      return $sce.trustAsHtml(converter.makeHtml(markdown));
    };

    // UPLOAD
    $scope.uploadPic = function(file) {
      Upload.base64DataUrl(file).then(function(response) {
        $scope.picFile=null;
        $scope.exercise.graphic=response;
      });
    };

    // SAVE
    $scope.saveExercise = function (){
      if ($stateParams.exerciseId!==undefined){
        $scope.exercises.$save($scope.exercise).then(function (){
          console.log('update!');
        });
      }
      else {
        $scope.exercises.$add($scope.exercise).then(function () {
          console.log('saved');
        });
      }
    };
  });
