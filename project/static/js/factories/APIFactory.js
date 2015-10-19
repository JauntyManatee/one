app.factory('APIFactory',['$http', function ($http) {

  var getTweets = function () {
    return $http({
      method: 'GET',
      url: '/tweetsfeed'
    });
  };

  var favTweet = function (id) {
    return $http({
      method: 'POST',
      url: 'https://api.twitter.com/1.1/favorites/create.json?id=' + id
    });
  };

  return {
    getTweets: getTweets,
    favTweet: favTweet
  };

}]);