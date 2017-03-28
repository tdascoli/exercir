;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('CollectionsEditorCtrl', function ($rootScope, $scope, $sce, $stateParams, $q, Ref, lodash, moment, PDFMakeService, collections, exercises) {

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
    $scope.trainingExercises = [];
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;
    $scope.training.trainer = $rootScope.profile.name;

    if ($stateParams.collectionId !== undefined) {
      $scope.training = $scope.collections.$getRecord($stateParams.collectionId);
      $scope.trainingExercises = prepareExercises();
    }

    $scope.showExercise=function(exerciseId){
      var exercise = lodash.filter($scope.trainingExercises, ['$id', exerciseId]);
      return exercise[0];
    };

    function prepareExercises(){
      var map = lodash.map($scope.training.exercises, 'exerciseId');
      var exercises = lodash.filter($scope.exercises, function(o) {
        if (map.indexOf(o.$id)>-1){
          return o;
        }
        return false;
      });
      return exercises;
    }

    // MARKDOWN
    $scope.showHtmlText = false;
    $scope.showHtml = function () {
      $scope.showHtmlText = !$scope.showHtmlText;
    };

    // PDF
    $scope.makePDF=function(output){
      var map = lodash.map($scope.training.exercises, 'exerciseId');
      var exercises = lodash.filter($scope.exercises, function(o) {
        if (map.indexOf(o.$id)>-1){
          return o;
        }
        return false;
      });
      var docDefinition = PDFMakeService.makeCollection($scope.training,exercises);
      /*
      var docDefinition = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [0, 60, 0, 40],

        footer: {columns: [
          { width: '50%', text: moment($scope.training.timestamp).format('DD.MM.YYYY')+' '+$scope.training.trainer, fontSize: 10 },
          { width: '50%', text: 'exercir © tdascoli', fontSize: 10, alignment: 'right' }
        ], margin: 20},

        content: collections,
        styles: {
          tableCollection: {
            margin: [0, 20, 0, 0]
          },
          collectionHeader: {
            fillColor: '#ff0000',
            bold: true
          },
          dfbTable: {
            fillColor: '#20ae80',
            color: '#ffffff',
            margin: [0, 0, 0, 20]
          },
          dfbTrainingTable: {

          },
          dfbHeader: {
            margin: [10, 2],
            fontSize: 14,
            bold: true
          },
          dfbBox: {
            margin: [20]
          },
          dfbLabel: {
            color: '#20ae80',
            fontSize: 10,
            bold: true
          },
          dfbText: {
            fontSize: 10
          }
        }
      };
      */
      if (output==='open') {
        // open the PDF in a new window
        pdfMake.createPdf(docDefinition).open();
      }
      if (output==='print') {
        // print the PDF
        pdfMake.createPdf(docDefinition).print();
      }
      if (output==='download') {
        // download the PDF / training.team - training.trainingDate
        pdfMake.createPdf(docDefinition).download($scope.training.titel+'.pdf');
      }
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
