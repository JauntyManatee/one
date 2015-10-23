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
          if(res.data === 'User added.') {
            $state.go('feed');
          }
        })
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
          } else {
          console.log(res.data);
          }
        })

      },

      logout: function(user) {
        return $http({
          method: 'POST',
          url: '/logout'
        })
        then(function(res) {
          if(res.data === 'Logged out.') {
            $state.go('home')
          }
        })
      }
    };
}]);
