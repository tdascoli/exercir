;(function () {
  'use strict';
/**
 * @ngdoc function
 * @name AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('exercirApp')
  .controller('AccountCtrl', function ($rootScope, $scope, $state) {

    $scope.updateProfile = function(){
      $rootScope.profile.$save().then(function(){
        $state.go('exercises');
      });
    };

  });

}());
