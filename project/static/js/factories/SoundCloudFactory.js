app.factory('SoundCloudFactory', ['$http', function  ($http) {
  var getSongs = function () {
    return $http({
      method : 'GET',
      url : '/soundcloud/stream'
    });
  };

  return {
    getSongs: getSongs
  };
}]);