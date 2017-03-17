;(function () {
  'use strict';
/**
 * @ngdoc function
 * @name AuthCtrl
 * @description
 * # AuthCtrl
 * Provides rudimentary account management functions.
 */
angular.module('exercirApp')
  .controller('AuthCtrl', function (Auth, Users, $scope, $rootScope, $state) {

    $scope.user = {
      email: '',
      password: ''
    };

    $scope.login = function (){
      Auth.$signInWithEmailAndPassword($scope.user.email,$scope.user.password).then(function (auth){
        Users.getProfile(auth.uid).$loaded().then(function (profile){
          $rootScope.profile=profile;
          $state.go('exercises');
        });
      }, function (error){
        $scope.error = error;
      });
    };

    $scope.logout=function(){
      Auth.$signOut().then(function(){
        $state.go('login');
      });
    };

    $scope.register = function (){
      Auth.$createUserWithEmailAndPassword($scope.user.email,$scope.user.password).then(function (){
        $scope.login();
      }, function (error){
        $scope.error = error;
      });
    };
  });

}());
