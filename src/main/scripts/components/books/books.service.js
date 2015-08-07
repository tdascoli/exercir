;(function() {

  'use strict';

  angular.module('exercir')
    .factory('BooksService', function ($http) {

      var path = 'resource/books';

      function all() {
        return $http.get(path);
      }

      function find(params) {
        var path = path;

        var counter = 0;
        for (var param in params) {
          if (params[param] || params[param] === false) {
            if (counter > 0) {
              path = path + '&'
            } else {
              path = path + '?';
            }
            path = path + param + '=' + params[param];
            counter++;
          }
        }
        return $http.get(path);
      }

      return {
        all: all,
        find: find
      }

    });


}());



