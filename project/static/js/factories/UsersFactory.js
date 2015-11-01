app.factory('UsersFactory', ['$location', '$http',  
  function($location, $http) {
    return {

      signup: function(user) {
          return $http({
          method: 'POST',
          url: '/signup',
          data: user
        });
      },

      login: function(user) {
       console.log('factory');
        return $http({
          method: 'POST',
          url: '/login',
          data: user
        });
      },

      logout: function(token) {
        return $http({
          method: 'POST',
          url: '/logout',
          data: token
        });
      }
    };
}]);
