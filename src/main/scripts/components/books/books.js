'use strict';

angular.module('exercir')
    .config(function ($stateProvider) {
        $stateProvider
            .state('books', {
                parent: 'site',
                url: '/books',
                sequence: 100,
                label: 'global.menu.books',
                data: {
                  roles: ['ROLE_USER_ADMIN', 'ROLE_SYSTEM_ADMIN']
                },
                views: {
                    'content@': {
                        templateUrl: 'views/content/books/books.html',
                        controller: 'BooksCtrl'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('books');
                        return $translate.refresh();
                    }]
                },
                glyph: 'book'
            });
    });
