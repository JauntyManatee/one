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
}]).directive('poseidon', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, ele, attrs) {
        console.log('hi');

        var svg = d3.select(ele[0])
          .append('svg')
          .style('width', '100%');

        // scope.render = function(data) {
        //   svg.selectAll('*').remove();
        // };

      }
    };
}]);