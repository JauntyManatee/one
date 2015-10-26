app.controller('BannerController', ['$scope', '$state', 'PostType', 
  function ( $scope, $state, PostType ) {
    
  $scope.postType = PostType;

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };

  $scope.logout = function() {
    var authToken = sessionStorage.getItem('at');
    UsersFactory.logout(authToken)
    .then(function ( res ) {
      if(res.data === 'Succesful logout.') {
        $state.go('home');
      }
      sessionStorage.clear();
    })
    .catch(function ( error ) {
      console.log(error);
    });
  };
}]);
