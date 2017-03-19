/**
 * @ngdoc function
 * @name mtgJsApp.directive:ngHideAuth
 * @description
 * # ngHideAuthDirective
 * A directive that shows elements only when user is logged out. It also waits for Auth
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('exercirApp')
  .directive('hideOnState', ['$state', function ($state) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, el, attrs) {
        var state = attrs.hideOnState;
        if ($state.includes(state)) {
          el.addClass('hide');
        }
      }
    };
  }])
  .directive('showOnState', ['$state', function ($state) {
    'use strict';

    return {
      restrict: 'A',
      link: function (scope, el, attrs) {
        var state = attrs.showOnState;
        el.addClass('hide');



        if ($state.includes(state)) {
          el.removeClass('hide');
        }
      }
    };
  }]);
