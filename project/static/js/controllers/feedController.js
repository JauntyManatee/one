app.controller('FeedController', ['$scope', 'APIFactory', function ($scope, APIFactory) {
  $scope.feed = ["test1", "test2"];

  $scope.getTweets = function () {
    APIFactory.getTweets().then(function(data) {
<<<<<<< HEAD
=======
      $scope.feed = data.data;
>>>>>>> c1afbe8605922d11eb2dfa2600f1b75dd86617b6
      console.log(data);
    });
  };
}]);