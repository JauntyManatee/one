app.controller('HomeController', ['$scope', 'UsersFactory', '$state', function ($scope, UsersFactory, $state) {
  $scope.logIn = function( username, password ) {
    var user = {'username': username, 'password': password};
    UsersFactory.login(user)
    .then(function(res) {
      if(res.data === 'Succesful login.') {
        console.log('Succesful login.');
        $state.go('feed');
      } else {
        console.log(res.data);
      }
    })
    .catch(function(err) {
      throw(err);
    });
  };

  $scope.signUp = function( username, password ) {
    var user = {'username': username, 'password': password};
    UsersFactory.signup(user)
    .then(function(res) {
      if(res.data === 'User added.') {
        console.log('User added.');
        $state.go('feed');
      }
    })
    .catch(function(err) {
      throw(err);
    });
  };
}]);
