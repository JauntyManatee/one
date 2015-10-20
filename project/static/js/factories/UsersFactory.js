app.factory('UsersFactory', ['$http', 
  function($http, $location, $window) {
    return {

      checkUserExists: function(user) {
       console.log('factory');
        return $http({
          method: 'POST',
          url: '/login',
          data: user
        });
      },

      addUser: function(user) {
        return $http({
          method: 'POST',
          url: '/signup'
        });
      },

      logout: function(user) {
        return $http({
          method: 'POST',
          url: '/logout'
        });
      }
    };
}]);
