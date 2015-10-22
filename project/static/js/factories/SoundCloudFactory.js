app.factory('SoundCloudFactory', ['$http', function  ($http) {
  var getSongs = function () {
    return $http({
      method : 'GET',
      url : '/soundStream'
    });
  };

  return {
    getSongs: getSongs
  };
}]);