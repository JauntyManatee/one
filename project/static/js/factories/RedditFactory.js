app.factory('RedditFactory', ['$http', function ( $http ) {

  var getRedditFeed = function ( ) {
    return $http({
      method: 'GET',
      url: '/reddit/hot'
    });
  };

  return {
    getRedditFeed: getRedditFeed
  };
}]);