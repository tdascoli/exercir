'use strict';

angular.module('exercir')
    .controller('MainController', function ($scope, Principal) {

    $scope.account = Principal.getIdentity();
    $scope.isAuthenticated = Principal.isAuthenticated;

    });
