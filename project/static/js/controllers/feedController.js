app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', function ( $scope, TwitterFactory, InstagramFactory ) {
  $scope.TwitterFeed = [];
  $scope.InstagramFeed = [];
  $scope.times = [];

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      console.log(data);
      if(Array.isArray(data.data)){
        $scope.TwitterFeed = data.data;
      }
    });
  };

  $scope.favTweet = function ( id ) {
    TwitterFactory.favTweet(id).then(function ( response ) {
      console.log(response);
    });
  };

  $scope.reTweet = function ( id ) {
    TwitterFactory.reTweet(id).then(function ( response ) {
      console.log(response);
    });
  };

  $scope.getInstaFeed = function ( ) {
    InstagramFactory.getInstaFeed().then(function ( data ) {
      console.log(data);
      if(typeof data.data !== 'string') {
        $scope.InstagramFeed = data.data.data;
      }
    });
  };
}]);