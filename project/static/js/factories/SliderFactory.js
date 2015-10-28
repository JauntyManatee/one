app.factory('SliderFactory', ['$http','$q', function ( $http, $q ) {

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
    //ugly will refactor but not now :(
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

  var _instagramFollow = function (obj) {
    return getIgStats().then(function (r) {
      return obj['instagram'] = {
        'followers' : r['data']['counts']['followed_by'],
        'following' : r['data']['counts']['follows']
      };
    });
  };

  var _twitterFollow = function (obj) {
    return getTwitterStats().then(function (r) {
      return obj['twitter'] = {
        'followers' : r['followers']['data']['ids'].length,
        'following' : r['following']['data']['ids'].length
      };
    });
  };

  var _soundcloudFollow = function(obj){
    return getSoundcloudStats().then(function (r) {
      return obj['soundcloud'] = {
        'followers' : r['data']['followers_count'],
        'following' : r['data']['followings_count']
      };
    });
  }

  var getFollowStats = function (mediaObj) {

    mediaObj = mediaObj || {
        twitter : true,
        soundcloud : true,
        instagram : true
      }

    return $q(function (resolve, reject) {

      var obj = {}

      mediaObj['twitter'] ? _instagramFollow(obj) : null;

      mediaObj['soundcloud'] ? _soundcloudFollow(obj) : null;

      mediaObj['twitter'] ? _twitterFollow(obj) : null;

      resolve(obj);

    })
    .then(function (obj) {
      return obj;
    });
  };

  return {
    getSoundcloudStats : getSoundcloudStats,
    getIgStats : getIgStats,
    getTwitterStats : getTwitterStats,
    getFollowStats : getFollowStats
  };

}]);