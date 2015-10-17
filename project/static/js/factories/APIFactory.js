app.factory('APIFactory',['$http', function ($http) {

  var getTwitterToken = function () {
    return $http({
      method: 'POST',
      url: 'https://www.api.twitter.com/oauth/request_token',
      data: {
        oauth_callback: ''
      }
    });
  };

  var getTweets = function () {
    return $http({
      method: 'GET',
      url: 'https://www.api.twitter.com/1.1/statuses/home_timeline.json'
    });
  };

  return {
    getTweets: getTweets,
    getTwitterToken: getTwitterToken
  };

}]);