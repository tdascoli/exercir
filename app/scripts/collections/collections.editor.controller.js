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

    $scope.showExercise=function(exerciseId){
      var exercise = lodash.filter($scope.exercises, ['$id', exerciseId]);
      return exercise[0];
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

    // PDF
    $scope.makePDF=function(output){
      var i=0;
      var collections=[];
      collections.push({text:$scope.training.titel,bold:true,fontSize:18});
      angular.forEach($scope.training.exercises, function (trainingExercise) {
        var exercise=$scope.showExercise(trainingExercise.exerciseId);
        var collection=[];

        // PageBreak
        if (i>0) {
          collection.push({text: '', pageBreak: 'before'});
        }
        i++;

        // Trainingsinhalt
        var trainingsinhalt='';
        angular.forEach(trainingExercise.content, function(value){
          trainingsinhalt+=value.text+', ';
        });
        trainingsinhalt=trainingsinhalt.substr(0,(trainingsinhalt.length-2));
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [
              [{text:'Trainingsinhalt', style: 'collectionHeader'}],
              [trainingsinhalt]
            ]
          }
        });

        // Grafik/Beschreibung
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['50%','50%'],
            headerRows: 1,
            body: [
              [{text:'Grafik', style: 'collectionHeader'},{text:'Beschreibung', style: 'collectionHeader'}],
              [{image: exercise.graphic, width: 200},exercise.description]
            ]
          }
        });

        // Aufbau
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [
              [{text:'Aufbau', style: 'collectionHeader'}],
              [exercise.aufbau || ' ']
            ]
          }
        });

        // Coaching
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [
              [{text:'Coaching', style: 'collectionHeader'}],
              [exercise.coaching || ' ']
            ]
          }
        });

        // Variationen
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [
              [{text:'Variationen', style: 'collectionHeader'}],
              [exercise.variationen || ' ']
            ]
          }
        });

        // Bemerkungen
        collection.push({
          style: 'tableCollection',
          table: {
            widths: ['100%'],
            headerRows: 1,
            body: [
              [{text:'Bemerkungen', style: 'collectionHeader'}],
              [trainingExercise.bemerkungen || ' ']
            ]
          }
        });
        collections.push(collection);
      });

      var docDefinition = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 20, 40 ],

        footer: { text: 'exercir (c) tdascoli', alignment: 'right', margin: 20 },

        content: collections,
        styles: {
          tableCollection: {
            margin: [0, 20, 0, 0]
          },
          collectionHeader: {
            fillColor: '#ff0000',
            bold: true
          }
        }
      };

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
