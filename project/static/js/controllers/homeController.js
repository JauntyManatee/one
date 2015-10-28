app.controller('HomeController', ['$scope', 'UsersFactory', '$location', function ($scope, UsersFactory, $location) {
  $scope.logIn = function( username, password ) {
    var user = {'username': username, 'password': password};
    $scope.verifier ={
      errorz : ''
    };
    UsersFactory.login(user)
    .then(function(res) {
      if(res.data === 'Incorrect username or password.') {
        console.log('Incorrect username or password');
        $scope.verifier.errorz = "Incorrect username or password!";
        $scope.loginForm.$setPristine();
      } else if (res.data === 'Succesful login.') {
        console.log('User added.', res.data);
        sessionStorage.setItem('at', res.data.auth_token);
        $location.path('feed');
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
      } else {
        console.log('User added.', res.data);
        sessionStorage.setItem('at', res.data.auth_token);
        $location.path('feed');
      }
    })
    .catch(function(err) {
      throw(err);
    });
  };

}]);
