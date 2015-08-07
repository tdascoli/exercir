;(function() {
  'use strict';

  angular.module('exercir').config(function(LanguageServiceProvider) {
    LanguageServiceProvider.setLanguages(['de', 'fr', 'it', 'en']);
  });

}());

