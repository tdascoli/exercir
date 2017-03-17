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
  .controller('AccountCtrl', function ($rootScope, $scope, $state, Organizations) {

    $scope.club={};
    if ($rootScope.profile.club!==undefined){
      Organizations.getOrganization($rootScope.profile.club).$loaded().then(function (club){
        $scope.club = club;
      });
    }

    if ($rootScope.profile.subscriptions===undefined){
      $rootScope.profile.subscriptions=['basic'];
    }

    $scope.updateProfile = function(){
      $rootScope.profile.$save().then(function(){
        //$state.go('exercises');
        // todo console.log > Message Service !! > Toasts!
        console.log('profile saved');
      });
    };

    $scope.updateOrganization = function(){
      if ($rootScope.profile.club===undefined) {
        Organizations.organizations.$add($scope.club).then(function (ref) {
          console.log('organization saved: '+ref.key);
          $rootScope.profile.club=ref.key;
          $rootScope.profile.$save().then(function(){
            console.log('profile saved');
          });
        }, function errorCallback(response) {
          console.log('error!',response);
        });
      }
      else {
        $scope.club.$save().then(function () {
          console.log('update organization');
        });
      }
    };

  });

}());
