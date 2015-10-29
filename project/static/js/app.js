var app = angular
  .module('app', [
    'ngRoute',
    'ngSanitize',
    'd3',
    'pageslide-directive'
  ])
  .config(['$routeProvider', function($routeProvider) {

    $routeProvider
      .when( '/', {
        controller: 'HomeController',
        templateUrl:   'static/views/home.html'      
      })

      .when('/feed', { 
        controller: 'FeedController',
        templateUrl: 'static/views/feed.html'
      })

      .when('/test', {
        controller: 'SliderController',
        templateUrl: 'static/views/test.html'
      })

     .otherwise({
       redirectTo: '/'
     });

  }]);
