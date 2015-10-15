app.factory('APIFactory',['$http', function ($http) {

  var getTweets = function () {
    return $http({
      method: 'GET',
      url: 'https://api.twitter.com/1.1/statuses/home_timeline.json'
    });
  };

  return {
    getTweets: getTweets
  };

}]);