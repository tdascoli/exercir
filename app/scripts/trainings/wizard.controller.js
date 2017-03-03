;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('WizardCtrl', function ($scope, $sce, lodash) {

    $scope.editTrainingIndex=false;

    // SEARCH
    $scope.searchResult=[];

    $scope.$watch('training.content', function() {
      if ($scope.training.content!==undefined) {
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
      angular.forEach($scope.training.content, function (value) {
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

    $scope.addExercise=function (exerciseId) {
      if ($scope.training.exercises===undefined){
        $scope.training.exercises=[];
      }
      $scope.training.exercises.push({exerciseId:exerciseId});
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

    $scope.filterBy=function(){
      var filterBy=[];
      angular.forEach($scope.training.exercises, function(value){
        filterBy.push(value.exerciseId);
      });
      return filterBy;
    };

    $scope.sortableConf={
      handle: '.fa-arrows',
      animation: 150
    };

  });

  angular.module('exercirApp')
  .filter('inArray', function($filter){
    return function(list, arrayFilter, element){
      if(arrayFilter){
        return $filter('filter')(list, function(listItem){
          return arrayFilter.indexOf(listItem[element]) !== -1;
        });
      }
    };
  });

  angular.module('exercirApp')
    .filter('notInArray', function($filter){
      return function(list, arrayFilter, element){
        if(arrayFilter){
          return $filter('filter')(list, function(listItem){
            return arrayFilter.indexOf(listItem[element]) === -1;
          });
        }
      };
    });

}());
