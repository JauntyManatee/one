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
      url: '/favtweet',
      data: { id: id }
    });
  };

  var reTweet = function (id) {
    return $http({
      method: 'POST',
      url: '/retweet',
      data: { id: id }
    });
  };

  return {
    getTweets: getTweets,
    favTweet: favTweet,
    reTweet: reTweet
  };

}]);