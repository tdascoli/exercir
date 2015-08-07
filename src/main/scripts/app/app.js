;(function () {
  'use strict';

  var app = angular.module('exercir', [
    'LocalStorageModule',
    'tmh.dynamicLocale',
    'ngResource',
    'ui.router',
    'ngCookies',
    'pascalprecht.translate',
    'ngCacheBuster',
    'alv-ch-ng.core',
    'alv-ch-ng.security',
    'alv-ch-ng.scroll',
    'alv-ch-ng.forms',
    'exercir.i18n',
    'exercir.navigation'
  ]);

  app.config(["$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['If-Modified-Since'] = '01 Jan 1970 00:00:00 GMT';
  }]);

  app.config(function ($stateProvider, $urlRouterProvider, httpRequestInterceptorCacheBusterProvider, SecurityConfigProvider) {

    SecurityConfigProvider.setClientId('exercir');
    SecurityConfigProvider.setClientSecret('exercirSecret');


    //Cache everything except rest api requests
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*rest.*/, /.*protected.*/], true);

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('site', {
      'abstract': true,
      views: {
        'navbar@': {
          templateUrl: 'views/navbar/navbar.html',
          controller: 'NavbarCtrl'
        },
        'footer@': {
          templateUrl: 'views/footer/footer.html'
        }
      }
    });

  });

  app.config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        parent: 'site',
        url: '/error',
        data: {
          roles: [],
          hidden: true
        },
        views: {
          'content@': {
            templateUrl: 'views/content/error/error.html'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
            $translatePartialLoader.addPart('error');
            return $translate.refresh();
          }]
        },
        hidden: true
      })

  });

}());
