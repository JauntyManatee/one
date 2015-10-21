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
      if(typeof data.data !== 'string') {
        for (var i = 0; i < data.data.data.length; i++) {
          var date = new Date(data.data.data.created_time*1000);
          $scope.times[$scope.times.length] = date.getHours() + ":" + date.getMinutes();
        }
        $scope.InstagramFeed = data.data.data;
      }
    });
  };
}]);