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

    $scope.training = {};
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.collectionId !== undefined) {
      $scope.training = $scope.collections.$getRecord($stateParams.collectionId);
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
