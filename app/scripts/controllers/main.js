'use strict';

/**
 * @ngdoc function
 * @name exercirApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the exercirApp
 */
angular.module('exercirApp')
  .controller('MainCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.tags = [
      { text: 'just' },
      { text: 'some' },
      { text: 'cool' },
      { text: 'tags' }
    ];

    $scope.loadTags = function(query) {
      return $http.get('/tags?query=' + query);
    };
  });
