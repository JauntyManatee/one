app.controller('HomeController', ['$scope', 'UsersFactory', '$state', function ($scope, UsersFactory, $state) {
  $scope.logIn = function( username, password ) {
    var user = {'username': username, 'password': password};
    UsersFactory.login(user)
      .then(function(res) {
        console.log(res);
        return res.data;
      })
      .catch(function(err) {
        throw(err)
    });
  };

  $scope.signUp = function( username, password ) {
    var user = {'username': username, 'password': password};
    UsersFactory.signup(user)
      .then(function(res) {
        console.log(res)
        return res.data
      })
      .catch(function(err) {
        throw(err)
    });
  };
}]);
