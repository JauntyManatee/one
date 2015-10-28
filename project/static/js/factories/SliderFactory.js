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
    var stats = {}
    return $http({
      method : 'GET',
      url : '/twitter/following'
    })
    .then(function(following){
      return $http({
          method : 'GET',
          url: '/twitter/followers'
        }).then(function(followers){
          return {followers:followers, following:following}
        })
    })
    .catch(function(err){
      console.log('error in twitterStats',err);
    })
  };

  return {
    getSoundcloudStats: getSoundcloudStats,
    getIgStats: getIgStats,
    getTwitterStats: getTwitterStats
  };

}]);