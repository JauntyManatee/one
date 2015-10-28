var app = angular
  .module('app', [
    'ui.router',
    'ngSanitize',
    'd3',
    'pageslide-directive'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function( $urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home',{
        url: '/',
        views: {
          // "banner": {
          //   templateUrl: 'static/views/banner.html',
          //   controller: 'BannerController'
          // }, 
          "main": {
            templateUrl: 'static/views/home.html',
            controller: 'HomeController'
          }
        },
      })
      .state('feed',{
        url: '/feed',
        views: {
          "banner": {
            templateUrl: 'static/views/banner.html',
            controller: 'BannerController'
          }, 
          "main": {
            templateUrl: 'static/views/feed.html',
            controller: 'FeedController'
          }
        }
      })
      .state('test',{
        url: '/test',
        views: {
          "main": {
            templateUrl: 'static/views/test.html',
            controller: 'SliderController'
          }
        },
      })
  }]);
