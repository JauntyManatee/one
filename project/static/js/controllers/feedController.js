app.controller('FeedController', ['$scope', 'APIFactory', function ( $scope, APIFactory ) {
  $scope.feed = ["test1", "test2"];

  $scope.getTweets = function () {
    APIFactory.getTweets().then(function ( data ) {
      console.log(data);
      $scope.feed = data.data;
    });
  };

  $scope.favTweet = function ( id ) {
    APIFactory.favTweet(id).then(function ( response ) {
      console.log(response);
    });
  };

  $scope.reTweet = function ( id ) {
    APIFactory.reTweet(id).then(function ( response ) {
      console.log(response);
    });
  };
}]);