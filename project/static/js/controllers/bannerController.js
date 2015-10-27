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
}]).directive('poseidon', ['d3Service', function ( d3Service ) {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        // d3 code
        console.log('here');

        var svg = d3.select(element[0])
                    .append("svg")
                    .style('width', '100%');

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // hard-code data
        scope.data = [
          {name: "Greg", score: 98},
          {name: "Ari", score: 96},
          {name: 'Q', score: 75},
          {name: "Loser", score: 48}
        ];

        // Watch for resize event
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.render = function(data) {
          // remove all previous items before render
          svg.selectAll('*').remove();

          // If we don't pass any data, return out of the element
          if (!data) return;
        };
            
      });
    }
  };
}]);
