app.controller('SliderController', ['$scope','SliderFactory', function ($scope, SliderFactory) {
  $scope.stats = {}


  SliderFactory.getFollowStats()
    .then(function (d) { $scope.stats=d; });
}]);