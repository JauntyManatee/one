app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', function ( $scope, TwitterFactory, InstagramFactory, SoundCloudFactory ) {

  $scope.feed = [];

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      if(Array.isArray(data.data)){
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].created_at = new Date(data.data[i].created_at);
          data.data[i].twitter = true;
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
          var theDate = new Date(data.data.data[i].created_time*1000);
          data.data.data[i].created_at = theDate;
          data.data.data[i].instagram = true;
        }
        $scope.feed.push.apply($scope.feed, data.data.data);
        console.log($scope.feed);
      }
    });
  };

  $scope.getSongs = function ( ) {
    SoundCloudFactory.getSongs().then(function ( data ) {
      for (var i = 0; i < data.data.length; i++) {
        data.data[i]
      };
      $scope.feed.push.apply($scope.feed, data.data);
    });
  };
}]);