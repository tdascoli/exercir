;(function () {
  'use strict';

/**
 * @ngdoc overview
 * @name exercirApp
 * @description
 * # exercirApp
 *
 * Main module of the application.
 */
var app = angular.module('exercirApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngLodash',
    'ngTagsInput',
    'ui.router',
    'ui.router.menus',
    'ui.bootstrap',
    'firebase',
    'firebase.ref'
  ]);

  app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .state('exercises', {
        url: '/exercises',
        templateUrl: 'views/exercises/overview.html',
        controller: 'ExercisesCtrl',
        resolve: {
          exercises: function (Exercises,Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Exercises.getUserExercises(auth.uid);
            });
          },
          profile: function ($rootScope, $state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                $rootScope.profile = profile;
              });
            }, function(error){
              $state.go('login');
            });
          }
        }
      })
      .state('exercises/create', {
        url: '/exercises/create',
        templateUrl: 'views/exercises/editor.html',
        controller: 'ExercisesCtrl',
        resolve: {
          exercises: function (Exercises,Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Exercises.getUserExercises(auth.uid);
            });
          },
          profile: function ($rootScope, $state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                $rootScope.profile = profile;
              });
            }, function(error){
              $state.go('login');
            });
          }
        }
      })
      .state('trainings', {
        url: '/trainings',
        templateUrl: 'views/trainings/trainings.html',
        controller: 'MainCtrl'
      })
      .state('reviews', {
        url: '/reviews',
        controller: 'MainCtrl',
        templateUrl: 'views/reviews/reviews.html'
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl',
        templateUrl: 'views/auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(){
              $state.go('exercises');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('account', {
        url: '/account',
        controller: 'AccountCtrl',
        templateUrl: 'views/account/account.html',
        resolve: {
          profile: function ($rootScope, $state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                $rootScope.profile = profile;
              });
            }, function(error){
              $state.go('login');
            });
          }
        }
      });

  }]);

  app.run(function($rootScope, $state, Auth) {

    $rootScope.$on('$stateChangeError', console.log.bind(console));

    $rootScope.logout = function(){
      Auth.$signOut().then(function(){
        $state.go('login');
      });
    };
  });

}());
