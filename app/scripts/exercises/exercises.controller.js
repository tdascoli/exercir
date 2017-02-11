'use strict';

/**
 * @ngdoc function
 * @name mtgJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mtgJsApp
 */
angular.module('exercirApp')
  .controller('ExercisesCtrl', function ($scope, $http, exercises) {
    $scope.loadTags = function(query) {
      return $http.get('/tags?query=' + query);
    };

    $scope.exercises=exercises;

    $scope.exercise={};
    $scope.exercise.content = [
      { text: 'just' },
      { text: 'some' },
      { text: 'cool' },
      { text: 'tags' }
    ];


    // SAVE
    $scope.saveExercise = function (){
      $scope.exercises.$add($scope.exercise).then(function(ref){
        console.log('saved');
      });
    };
  });
