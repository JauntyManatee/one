app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', function ( $scope, TwitterFactory, InstagramFactory ) {
  $scope.TwitterFeed = [];
  $scope.InstagramFeed = [];
  $scope.feed = [];

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      if(Array.isArray(data.data)){
        for (var i = 0; i < data.data.length; i++) {
          var array = data.data[i].created_at.split(" ");
          array.splice(array.length - 2, 2);
          data.data[i].created_at = array.join(" ");
        }
        $scope.feed.push.apply($scope.feed, data.data);
        
        console.log($scope.feed);
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
          data.data.data[i].created_at = new Date(data.data.data[i].created_time*1000);
        }
        $scope.feed.push.apply($scope.feed, data.data.data);
        console.log($scope.feed);
      }
    });
  };
}]);