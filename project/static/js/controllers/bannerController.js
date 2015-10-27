app.controller('BannerController', ['$scope', '$state', 'PostType', 'UsersFactory', 
  function ( $scope, $state, PostType, UsersFactory ) {
    
  $scope.postType = PostType;

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };

  $scope.logout = function() {
    var authToken = sessionStorage.getItem('at');
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
      },
      link: function(scope, ele, attrs) {
      
        var svg = d3.select(ele[0])
          .append('svg')
          .style({'width': '100%', 'height': '100%'});

        var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", "../static/views/ONE.png")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", '100%')
                .attr("height", '795');

        // scope.render = function(data) {
        //   svg.selectAll('*').remove();
        // };

      }
    };
}]);