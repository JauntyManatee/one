app.controller('SliderController', ['$scope','SliderFactory', function ($scope, SliderFactory) {
  $scope.stats = {}
  $scope.here = 'here'
  // SliderFactory.getIgStats().then(function(r){ $scope.stats['igStats']=r });
  // SliderFactory.getSoundcloudStats().then(function(r){ $scope.stats['soundStats']=r });
  SliderFactory.getTwitterStats().then(function(r){ $scope.stats['twitterStats']=r });

}]);