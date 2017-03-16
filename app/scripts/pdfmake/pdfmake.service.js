'use strict';
angular.module('exercirApp')
  .factory('PDFMakeService', function($rootScope, moment, Exercises){

    function getExercise(exerciseId){
      return Exercises.getExercise($rootScope.profile.$id, exerciseId).$loaded();
    }

    function makePdf(training){

      var i=0;
      var collections=[];
      collections.push({text:training.titel,bold:true,fontSize:18});
      angular.forEach(training.exercises, function (trainingExercise) {
        var exercise=getExercise(trainingExercise.exerciseId);

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
        pageMargins: [ 20, 40 ],

        footer: {columns: [
          { width: '50%', text: moment(training.timestamp).format('DD.MM.YYYY')+' '+training.trainer, fontSize: 10 },
          { width: '50%', text: 'exercir © tdascoli', fontSize: 10, alignment: 'right' }
        ], margin: 20},

        content: collections,
        // todo markdown styles
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

      console.log(docDefinition);

      return docDefinition;
    }

    return {
      makePdf: makePdf
    };

  });
