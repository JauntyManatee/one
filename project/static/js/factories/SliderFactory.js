app.factory('SliderFactory', ['$http', function ( $http ) {

  var getIgStats = function () {
    return $http({
      method : 'GET',
      url : '/instagram/stats'
    });
  };

  var getSoundcloudStats = function () {
    return $http({
      method : 'GET',
      url : '/soundcloud/stats'
    });
  };

  var getTwitterStats = function () { 
    return $http({
      method : 'GET',
      url : '/twitter/stats'
    });
  };

  return {
    getSoundcloudStats: getSoundcloudStats,
    getIgStats: getIgStats,
    getTwitterStats: getTwitterStats
  };

}]);