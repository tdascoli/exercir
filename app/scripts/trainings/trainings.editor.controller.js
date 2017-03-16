;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('TrainingsEditorCtrl', function ($rootScope, $scope, $sce, $stateParams, $q, $firebaseArray, Ref, lodash, trainings, exercises) {

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

    $scope.exercise={};
    $scope.editTrainingIndex=false;

    $scope.training = {};
    $scope.training.timestamp = firebase.database.ServerValue.TIMESTAMP;
    $scope.training.trainer = $rootScope.profile.name;

    if ($stateParams.trainingId !== undefined) {
      $scope.training = $scope.trainings.$getRecord($stateParams.trainingId);
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
      console.log('search');
      $scope.searchResult = lodash.filter($scope.exercises, function(o) {
        return checkExerciseObject(o);
      });
    };

    $scope.addExercise=function () {
      if ($scope.training.exercises===undefined){
        $scope.training.exercises=[];
      }

      $scope.training.exercises.push($scope.exercise);
      $scope.exercise={};
    };

    $scope.addExerciseToCollection=function(){
        $scope.exercise.content=$scope.search;
        $scope.addExercise();
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
    $scope.showHtmlText = false;
    $scope.showHtml = function () {
      $scope.showHtmlText = !$scope.showHtmlText;
    };

    // PDF
    $scope.makePDF=function(output){
      var trainingsinhalt='';
      angular.forEach($scope.training.content, function(value){
        trainingsinhalt+=value.text+', ';
      });
      trainingsinhalt=trainingsinhalt.substr(0,(trainingsinhalt.length-2));

      var trainings=[];
      trainings.push([
        {text:'Lektionsteil', style: 'tableHeader'},
        {text:'Beschreibung', style: 'tableHeader'},
        {text:'Organisation', style: 'tableHeader'},
        {text:'Coaching', style: 'tableHeader'},
        {text:'Dauer', style: 'tableHeader'}
      ]);

      angular.forEach($scope.training.exercises, function (trainingExercise) {
        var exercise=$scope.showExercise(trainingExercise.exerciseId);
        var training=[];
        training.push(trainingExercise.lektionsteil || '-');
        training.push(markdownToPdfmake(exercise.description) || ' ');
        training.push({image: exercise.graphic, width: 200});
        training.push(markdownToPdfmake(exercise.coaching) || ' ');
        training.push(trainingExercise.dauer || '-');
        trainings.push(training);
      });

      var docDefinition = {
        // a string or { width: number, height: number }
        pageSize: 'A4',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 20, 40, 20, 60 ],

        // standard footer
        footer: {columns: [
          { width: '50%', text: moment($scope.training.timestamp).format('DD.MM.YYYY')+' '+$scope.training.trainer, fontSize: 10 },
          { width: '50%', text: 'exercir © tdascoli', fontSize: 10, alignment: 'right' }
        ], margin: 20},

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
            ],
            style: 'trainingHeader'
          },
          {
            style: 'tableTraining',
            table: {
              widths: ['15%', '25%', 200, '25%','*'],
              headerRows: 1,
              body: trainings
            }
          },
          {
            style: 'tableTraining',
            table: {
              widths: ['100%'],
              body: [
                {text: markdownToPdfmake($scope.training.bemerkungen)}
              ]
            }
          }
        ],
        styles: {
          tableTraining: {
            margin: [0, 20, 0, 0],
            fontSize: 10
          },
          tableHeader: {
            bold: true,
            fontSize: 10
          },
          trainingHeader: {
            fontSize: 10
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
