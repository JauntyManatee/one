var app = angular
  .module('app', [
    'ui.router'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function( $urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: 'static/views/home.html',
        controller: 'HomeController'
      })
      .state('feed',{
        url: '/feed',
        templateUrl: 'static/views/feed.html',
        controller: 'FeedController'
      });
  }]);