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
<<<<<<< HEAD
          } else {
          console.log(res.data);
          }
        })
=======
          }
          console.log(res);
        });
>>>>>>> d79167188dd6c18cace3befefd9a7db1bc805018

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
