app.factory('UsersFactory', ['$state', '$http',  
  function($state, $http) {
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

      logout: function(user) {
        return $http({
          method: 'POST',
          url: '/logout'
        })
        .then(function(res) {
          if(res.data === 'Logged out.') {
            $state.go('home');
          }
        });
      }
    };
}]);
