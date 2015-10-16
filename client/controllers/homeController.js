app.controller('HomeController', ['$scope', function ($scope) {
  $scope.logIn = function( username, password ) {
    console.log(username, password);
  };

  $scope.signUp = function( username, password ) {
    console.log(username, password);
  };
}]);
