app.controller('BannerController', ['$scope', '$state', 'PostType', 'UsersFactory', 
  function ( $scope, $state, PostType, UsersFactory ) {
    
  $scope.postType = PostType;

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };

  $scope.logout = function() {
    var authToken = sessionStorage.getItem('at');
    console.log(authToken);
    UsersFactory.logout({"at": authToken})
    .then(function ( res ) {
      sessionStorage.clear();
      $state.go('home');
    })
    .catch(function ( error ) {
      console.log(error);
    });
  };
}]);
