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

    // PDF
    $scope.makePDF=function(output){
      var trainingsinhalt='';
      angular.forEach($scope.training.content, function(value){
        trainingsinhalt+=value.text+', ';
      });
      trainingsinhalt=trainingsinhalt.substr(0,(trainingsinhalt.length-2));

      var trainings=[];
      trainings.push(['Lektionsteil', 'Beschreibung', 'Organisation', 'Coaching','Dauer']);
      angular.forEach($scope.training.exercises, function (trainingExercise) {
        var exercise=$scope.showExercise(trainingExercise.exerciseId);
        var training=[];
        training.push(trainingExercise.lektionsteil || '-');
        training.push(exercise.description || ' ');
        training.push({image: exercise.graphic, width: 200});
        training.push(exercise.coaching || ' ');
        training.push(trainingExercise.dauer || '-');
        trainings.push(training);
      });

      var docDefinition = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 20, 40 ],

        footer: { text: 'exercir (c) tdascoli', alignment: 'right', margin: 20 },

        content: [
          {
            columns: [
              { width: '25%', text: [
                {
                  text: $scope.training.team+'\n', bold: true
                },
                'Trainer: '+$scope.training.trainer+'\n',
                'Datum: '+$scope.training.trainingDate+'\n']
              },
              { width: '50%', text: [{text: 'Trainingsinhalt\n', bold:true},trainingsinhalt] },
              { width: '25%', text: 'Logo', alignment: 'right' }
            ]
          },
          {
            style: 'tableTraining',
            table: {
              widths: ['15%', '25%', 200, '25%','*'],
              headerRows: 1,
              body: trainings
            }
          }
        ],
        styles: {
          tableTraining: {
            margin: [0, 20, 0, 0]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
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
        pdfMake.createPdf(docDefinition).download($scope.training.team+'-'+$scope.training.trainingDate+'.pdf');
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
