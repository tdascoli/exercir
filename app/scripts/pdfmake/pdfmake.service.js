'use strict';
angular.module('exercirApp')
  .factory('PDFMakeService', function($rootScope, moment, lodash){

    function getExercise(exercises, exerciseId){
      var exercise = lodash.filter(exercises, ['$id', exerciseId]);
      return exercise[0];
    }

    function makeCollection(training,exercises){
      var i=0;
      var collections=[];
      collections.push({text:training.titel,bold:true,fontSize:18});

      angular.forEach(training.exercises, function (trainingExercise) {
        var exercise=getExercise(exercises,trainingExercise.exerciseId);

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
              [{image: exercise.graphic, width: 250}, markdownToPdfmake(exercise.description)]
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
              [markdownToPdfmake(exercise.aufbau) || ' ']
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
              [markdownToPdfmake(exercise.coaching) || ' ']
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
              [markdownToPdfmake(exercise.variationen) || ' ']
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
              [markdownToPdfmake(trainingExercise.bemerkungen) || ' ']
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
        pageMargins: [20, 40],

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
          }
        }
      };
      return docDefinition;
    }

    function makeCollectionDFB(training,exercises){
      // rgb(32, 174, 128)
      var i=0;
      var collections=[];
      //moment($scope.training.timestamp).format('DD.MM.YYYY')+' '+$scope.training.trainer

      angular.forEach(training.exercises, function (trainingExercise) {
        var exercise=getExercise(exercises,trainingExercise.exerciseId);

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
          style: 'dfbTrainingTable',
          border: [false, false, false, false],
          table: {
            widths: ['60%','*'],
            body: [
              [
                {rowSpan: 7, image: exercise.graphic, width: 300, border: [false, false, false, false]},
                {text: [
                  {text: exercise.name+'\n', style: 'dfbTitle'},
                  {text: 'von '+training.trainer+' ('+moment(training.timestamp).format('DD.MM.YYYY')+')', style: 'dfbText'}
                ], border: [false, false, false, false]}
              ],
              ['',{text: [{text:'Trainingsinhalt'+'\n', style: 'dfbLabel'},{text: trainingsinhalt, style: 'dfbText'}], border: [false, false, false, false]}],
              ['',{text: [{text:'Organisation'+'\n', style: 'dfbLabel'},{text:markdownToPdfmake(exercise.description) || '-', style: 'dfbText'}], border: [false, false, false, false]}],
              ['',{text: [{text:'Ablauf'+'\n', style: 'dfbLabel'},{text:markdownToPdfmake(exercise.aufbau) || '-', style: 'dfbText'}], border: [false, false, false, false]}],
              ['',{text: [{text:'Variationen'+'\n', style: 'dfbLabel'},{text:markdownToPdfmake(exercise.variationen) || '-', style: 'dfbText'}], border: [false, false, false, false]}],
              ['',{text: [{text:'Tipps und Korrekturen'+'\n', style: 'dfbLabel'},{text:markdownToPdfmake(exercise.coaching) || '-', style: 'dfbText'}], border: [false, false, false, false]}],
              ['',{text: [{text:'Bemerkungen'+'\n', style: 'dfbLabel'},{text:markdownToPdfmake(trainingExercise.bemerkungen) || '-', style: 'dfbText'}], border: [false, false, false, false]}]
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
        pageMargins: [20, 110, 20, 20],

        header: [
          {columns: [
            { width: '50%', text: ['ZEILE 1\n','ZEILE 2'], fontSize: 6 },
            { width: '50%', text: 'FCL.CH/MEIN-FUSSBALL', fontSize: 14, bold: true, alignment: 'right' }
          ], margin: 20},
          {
            style: 'dfbTable',
            table: {
              widths: ['100%'],
              body: [
                [{text:training.titel, style: 'dfbHeader', border: [false, false, false, false]}]
              ]
            }
          }],

        footer: { text: 'exercir © tdascoli', fontSize: 8, alignment: 'center' },

        content: collections,
        styles: {
          dfbTable: {
            fillColor: '#20ae80',
            color: '#ffffff'
          },
          dfbTitle: {
            color: '#20ae80',
            fontSize: 12,
            bold: true
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

      return docDefinition;
    }

    return {
      makeCollection: makeCollection,
      makeCollectionDFB: makeCollectionDFB
    };

  });
