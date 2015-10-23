app.factory('UsersFactory', ['$state', '$http',  
  function($state, $http) {
    return {

      signup: function(user) {
        return $http({
          method: 'POST',
          url: '/signup',
          data: user
        })
        .then(function(res) {
          console.log(res);
          $state.go('feed');
          
        });
      },

      login: function(user) {
       console.log('factory');
        return $http({
          method: 'POST',
          url: '/login',
          data: user
        })
        .then(function(res) {
          console.log(res);
          if(res.data === 'Succesful login.') {
            $state.go('feed');
          }
          console.log(res);
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
