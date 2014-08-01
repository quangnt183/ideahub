// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

ideahub = angular.module('ideahub', ['ionic'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('projects', {
      url: '/projects',
      templateUrl: 'partials/projects.html',
      controller: 'projCtrl'
    }).state('documents', {
      url: '/documents',
      templateUrl: 'partials/documents.html',
      controller: 'docCtrl'
    });
  $urlRouterProvider.otherwise("/projects");

  
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
