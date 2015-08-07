'use strict';

angular.module('exercir')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/',
                sequence: 0,
                label: 'global.menu.home',
                glyph: 'home',
                hidden: true,
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'views/content/main/main.html',
                        controller: 'MainController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        return $translate.refresh();
                    }]
                }
            });
    });
