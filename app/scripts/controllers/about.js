'use strict';

/**
 * @ngdoc function
 * @name exercirApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the exercirApp
 */
angular.module('exercirApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.sortableConf = {
      animation: 350,
      chosenClass: 'sortable-chosen',
      forceFallback: true
    };
  });
