;(function () {
  'use strict';

angular.module('exercirApp')
  .controller('ExercisesCtrl', function ($rootScope, $scope, $sce, $stateParams, $q, Ref, Upload, lodash, exercises) {


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

    $scope.exercise = {};
    $scope.exercise.timestamp = firebase.database.ServerValue.TIMESTAMP;

    if ($stateParams.exerciseId !== undefined) {
      $scope.exercise = $scope.exercises.$getRecord($stateParams.exerciseId);
    }

    // MARKDOWN
    $scope.showHtmlText = false;
    $scope.showHtml = function () {
      $scope.showHtmlText = !$scope.showHtmlText;
    };

    // SEARCH
    $scope.searchResult=$scope.exercises;

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
      if ($scope.search.length===0){
        $scope.searchResult=$scope.exercises;
      }
      else {
        $scope.searchResult = lodash.filter($scope.exercises, function (o) {
          return checkExerciseObject(o);
        });
      }
    };

    $scope.filterBy=function(){
      var filterBy=[];
      angular.forEach($scope.exercises, function(value){
        filterBy.push(value.exerciseId);
      });
      return filterBy;
    };

    // UPLOAD
    $scope.uploadPic = function (file) {
      Upload.base64DataUrl(file).then(function (response) {
        $scope.picFile = null;

        var storageRef = firebase.storage().ref();
        storageRef.child($rootScope.profile.$id+'/'+file.name).putString(response, 'data_url').then(function(snapshot) {
          $scope.exercise.graphicUrl = snapshot.downloadURL;
          console.log('Uploaded a data_url!', snapshot.downloadURL);
        });
      });
    };

    function getImageUrl(image) {
      var storageRef = firebase.storage().ref();
      var url;
      var pathReference = storageRef.child(image);
      return pathReference.getDownloadURL().then(function(url) {
        return url;
      }).catch(function(error) {
        // Handle any errors
      });
    }
    $scope.getImageUrl = function(image) {
      return $q(function(resolve){
        var imageUrl = getImageUrl(image).then(function(url) {
          imageUrl = url;
          console.log(url);
          resolve(imageUrl);
        });
      });
    };

    $scope.showImageUrl=function(image){
      return $q(function(resolve){
        var storageRef = firebase.storage().ref();
        storageRef.child(image).getDownloadURL().then(function(url){
          console.log(url);
          resolve(url);
        });
      });
    };

    // SAVE
    $scope.saveExercise = function () {
      if ($stateParams.exerciseId !== undefined) {
        $scope.exercises.$save($scope.exercise).then(function () {
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
