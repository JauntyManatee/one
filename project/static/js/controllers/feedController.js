app.controller('FeedController', ['$scope', 'APIFactory', function ($scope, APIFactory) {
  $scope.feed = ["test1", "test2"];

  $scope.getTweets = function () {
    APIFactory.getTweets().then(function(data) {
      console.log(data);
      $scope.feed = data.data;
    });
  };
}]);