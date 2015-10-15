app.controller('FeedController', ['$scope', 'APIFactory', function ($scope, APIFactory) {
  $scope.feed = ["hello", "goodbye"];

  $scope.getTweets = function () {
    APIFactory.getTweets().then(function(data) {
      console.log(data);
    });
  };
}]);