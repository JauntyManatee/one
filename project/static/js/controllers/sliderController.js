app.controller('SliderController', ['$scope','SliderFactory', function ($scope, SliderFactory) {
  $scope.stats = {}

  SliderFactory.getIgStats().then(function(r){ 
    $scope.stats['instagram'] = {
      'followers' : r['data']['counts']['followed_by'],
      'following' : r['data']['counts']['follows']
    };
  });

  SliderFactory.getSoundcloudStats().then(function(r){ 
    $scope.stats['soundcloud'] = {
      'followers' : r['data']['followers_count'],
      'following' : r['data']['followings_count']
    };
  });

  SliderFactory.getTwitterStats().then(function(r){ 
    $scope.stats['twitter'] = {
      'followers' : r['followers']['data']['ids'].length,
      'following' : r['following']['data']['ids'].length
    };
  });

  SliderFactory.getFollowStats()
    .then(function (d) { $scope.stats=d; });
}]);