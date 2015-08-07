;(function () {
  'use strict';

  var module = angular.module('exercir.navigation', ['ui.router', 'alv-ch-ng.security']);

  module.run(function ($rootScope, $state, NavbarService) {

    $rootScope.back = NavbarService.back;

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.previousStateName = fromState.name;
      $rootScope.previousStateParams = fromParams;
    });
  })

  module.controller('NavbarCtrl', function ($scope, $state, Principal) {
    $scope.$state = $state;


      $scope.isAuthenticated = Principal.isAuthenticated;
      $scope.isInRole = Principal.isInRole;


  });

  module.provider('NavbarService', function () {
    var _state, _rootScope;

    function _back() {
      // If previous state dord not exist go to 'home'
      if (_state.get(_rootScope.previousStateName) === null) {
        _state.go('home');
      } else {
        _state.go(_rootScope.previousStateName, _rootScope.previousStateParams);
      }
    };

    function initModel() {
      var allStates = _state.get();
      var namedStates = {};
      var waitingChildren = {};
      for (var i = 0; i < allStates.length; i++) {
        var state = allStates[i];
        namedStates[state.name] = state;
        if (state.parent) {
          var parent = namedStates[state.parent]
          if (namedStates[state.parent]) {
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(state);
          } else {
            if (!waitingChildren[parent.name]) {
              waitingChildren[parent.name] = [];
            }
            waitingChildren.push(state);
          }
        }
        if (waitingChildren[state.name]) {
          state.children = waitingChildren[state.name];
          delete waitingChildren[state.name];
        }
      }

    }

    this.$get = function ($rootScope, $state) {
      _rootScope = $rootScope;
      _state = $state;
      initModel();
      return {
        back: _back
      };
    }
  });

  module.directive('activeMenu', function ($translate) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var language = attrs.activeMenu;

        scope.$watch(function () {
          return $translate.use();
        }, function (selectedLanguage) {
          if (language === selectedLanguage) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }
        });
      }
    };
  });
  module.directive('activeLink', function (location) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var clazz = attrs.activeLink;
        var path = attrs.href;
        path = path.substring(1); //hack because path does bot return including hashbang
        scope.location = location;
        scope.$watch('location.path()', function (newPath) {
          if (path === newPath) {
            element.addClass(clazz);
          } else {
            element.removeClass(clazz);
          }
        });
      }
    };
  });

  module.directive('navbar', function () {

    return {
      restrict: 'E',
      replace: true,
      controller: 'NavbarCtrl',
      template: '<nav class="navbar navbar-default" role="navigation"></nav>',
      link: function (scope, element, attrs) {

        var container = angular.element('<div class="container"></div>');
        var navbarHeader = angular.element('<div class="navbar-header">' +
        '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">' +
        '<span class="sr-only">Toggle navigation</span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '</button>' +
        '<a class="navbar-brand" href="#"><span translate="' + attrs.applicationTitle + '">jhipster</span></a>' +
        '</div>');

        container.append(navbarHeader);


        element.append(container);
      }
    }
  });

  module.directive('navbarHeader', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="navbar-header"></div>',
      compile: function (element, attrs) {
        var navbarToggle = angular.element('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">' +
        '<span class="sr-only">Toggle navigation</span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '</button>');
        element.append(navbarToggle);
        var brand = angular.element('<a class="navbar-brand" href="#/"></a>');
        if (attrs.brandImage) {
          var image = angular.element('<img height="" style="position: relative; top: -2px; height: 100%; margin-right: 10px;" src="' + attrs.brandImage + '" />');
          brand.append(image);
        }

        var title = angular.element('<span translate="' + attrs.navbarTitle + '"></span>');
        brand.append(title);
        element.append(brand);
      }
    }
  });

  module.directive('navbarCollapse', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="collapse navbar-collapse" id="navbar-collapse"><ul class="nav navbar-nav nav-pills" ng-transclude></ul></div>',
      compile: function (element, attrs) {
        if (attrs.align) {
          element.find('ul.navbar-nav').addClass('pull-' + attrs.align);
        }
      }
    }
  });

  module.directive('navbarMenuItem', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<li ui-sref-active="active"></li>',
      compile: function (element, attrs) {
        var a = angular.element('<a ui-sref="' + attrs.menuSref + '"></a>');
        if (attrs.menuGlyph) {
          a.append(angular.element('<span class="glyphicon glyphicon-' + attrs.menuGlyph + '"></span>'))
        }
        a.append(angular.element('<span style="margin-left: 5px;" translate="' + attrs.menuTitle + '"></span>'));
        element.append(a);
      }
    }
  });

  module.directive('navbarMenuDropdown', function ($compile) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: true,
      template: '<li ui-sref-active="active" class="dropdown pointer"><ul class="dropdown-menu" ng-transclude></ul></li>',
      link: function (scope, element, attrs) {
        scope.menuActiveState = attrs.menuActiveState;
        var a = angular.element('<a class="dropdown-toggle" data-toggle="dropdown" href="">');
        var wrapper = angular.element('<span></span>');
        a.append(wrapper);
        if (attrs.menuGlyph) {
          wrapper.append(angular.element('<span class="glyphicon glyphicon-' + attrs.menuGlyph + '"></span>'))
        }
        wrapper.append(angular.element('<span class="hidden-tablet" style="margin-right: 5px; margin-left: 5px;" translate="' + attrs.menuTitle + '"></span>'));
        wrapper.append(angular.element('<b class="caret"></b>'));
        $compile(a)(scope);
        element.prepend(a);
      }
    }
  });

  module.directive('navbarSubmenuItem', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<li ui-sref-active="active"></li>',
      compile: function (element, attrs) {
        var a = angular.element('<a ui-sref="' + attrs.submenuSref + '"></a>')
        if (attrs.submenuGlyph) {
          a.append(angular.element('<span class="glyphicon glyphicon-' + attrs.submenuGlyph + '"></span>'))
        }
        a.append(angular.element('<span style="margin-left: 5px;" translate="' + attrs.submenuTitle + '"></span>'));
        element.append(a);
      }
    }
  });

  module.directive('navbarItems', function ($state, $filter, $compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var i, kid;
        var items = [];
        var children = $state.get('site').children;
        for (i = 0; i < children.length; i++) {
          var child = children[i];
          if (!child.hidden) {
            items.push(child);
          }
        }
        items = $filter('orderBy')(items, 'sequence', (attrs.itemAddType && attrs.itemAddType === 'prepend'));

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.children && item.children.length > 0 ) {
            kid = angular.element('<navbar-menu-dropdown menu-glyph="' + item.glyph + '" menu-title="' + item.label + '" ng-class="{active: $state.includes(\'' + item.name + '\')}">');
            var subItems = $filter('orderBy')(item.children, 'sequence');
            for (var j = 0; j < subItems.length; j++) {
              var subItem = subItems[j];
              if (!subItem.hidden) {
                kid.append(angular.element('<navbar-submenu-item submenu-sref="' + subItem.name + '" submenu-glyph="' + subItem.glyph + '" submenu-title="' + subItem.label + '"></navbar-submenu-item>'));
              }

            }
          } else if (item.abstract) {
            kid = angular.element('<navbar-menu-dropdown menu-glyph="' + item.glyph + '" menu-title="' + item.label + '" ng-class="{active: $state.includes(\'' + item.name + '\')}">');
          } else {
            kid = angular.element('<navbar-menu-item menu-sref="' + item.name + '" menu-glyph="' + item.glyph + '" menu-title="' + item.label + '"></navbar-menu-item>');
          }

          if (item.data) {
            if (item.data.authenticated && !item.data.roles) {
              kid.attr('authenticated', '');
            }
            if (item.data.roles) {
              kid.attr('any-role', item.data.roles);
            }
          }


          $compile(kid)(scope);

          if (!attrs.itemAddType || attrs.itemAddType === 'append') {
            element.find('ul.nav.navbar-nav').append(kid);
          } else {
            element.find('ul.nav.navbar-nav').prepend(kid);
          }
        }

      }
    }
  });

}());
