app.controller('HomeController', ['$scope', 'UsersFactory', function ($scope, UsersFactory) {
  $scope.logIn = function( username, password ) {
    console.log(username, password);
    var user = {'username': username, 'password': password};
    UsersFactory.checkUserExists(user)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        throw(err)
    });
  };

  $scope.signUp = function( username, password ) {
    console.log(username, password);
    UsersFactory.checkUserExists()
      .then(function(res) {
      })
      .catch(function(err) {
        throw(err)
    });
    //UsersFactory.addUser()
    //  .then(function(res) {
    //  })
    //  .catch(function(err) {
    //    throw(err)
    //});
  };
}]);
