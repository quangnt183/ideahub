var ideahub = angular.module('ideahub', ['ionic', 'pubnub.angular.service'])
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
    }).state('pages', {
      url: '/pages',
      templateUrl: 'partials/pages.html',
      controller: 'pageCtrl'
    });
  $urlRouterProvider.otherwise("/projects");
})
.run(function($ionicPlatform) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
});

