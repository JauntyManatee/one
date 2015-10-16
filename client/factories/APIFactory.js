app.factory('APIFactory',['$http', function ($http) {

  var getTwitterToken = function () {
    return $http({
      method: 'POST',
      url: 'https://api.twitter.com/oauth/request_token',
      data: {
        oauth_callback: ''
      }
    });
  };

  var getTweets = function () {
    return $http({
      method: 'GET',
      url: '/tweetsfeed'
    });
  };

  return {
    getTweets: getTweets,
    getTwitterToken: getTwitterToken
  };

}]);