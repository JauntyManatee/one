app.controller('HomeController', ['$scope', 'UsersFactory', '$state', function ($scope, UsersFactory, $state) {
  $scope.verifier ={
    errorz : ''
  };
  $scope.logIn = function( username, password ) {
    var user = {'username': username, 'password': password};
    UsersFactory.login(user)
    .then(function(res) {
      if(res.data === 'Incorrect username or password.') {
        console.log('Incorrect username or password');
        $scope.verifier.errorz = "Incorrect username or password!";
        $scope.loginForm.$setPristine();
      } else if (res.data.auth_token) {
        console.log('User added.', res.data);
        sessionStorage.setItem('at', res.data.auth_token);
        $state.go('feed');
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
      if(res.data === 'User already exists.') {
        console.log('User already exists.');
        $scope.verifier.errorz = "Incorrect username or password!";
        $scope.loginForm.$setPristine();
      } else {
        console.log('User added.', res.data);
        sessionStorage.setItem('at', res.data.auth_token);
        $state.go('feed');
      }
    })
    .catch(function(err) {
      throw(err);
    });
  };
}]);
