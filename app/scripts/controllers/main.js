'use strict';

/**
 * @ngdoc function
 * @name exercirApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the exercirApp
 */
angular.module('exercirApp')
  .controller('MainCtrl', function ($scope, $q, Ref) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.loadTags = function(query) {
      return $q(function(resolve) {

        Ref.child('data/training-content')
          .orderByChild('text')
          .startAt(query)
          .endAt(`${query}\uf8ff`)
          .once('value', function (snap) {
            var records = [];
            snap.forEach(function (ss) {
              records.push(ss.val());
            });
            resolve({data: records});
          });

      });
    };
  });
