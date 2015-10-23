app.controller('BannerController', ['$scope', 'PostType', function ( $scope, PostType ) {
  $scope.postType = PostType;

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };
}]);