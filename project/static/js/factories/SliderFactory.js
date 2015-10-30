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
      return err;
    });
  };

  var _instagramFollow = function () {
    return getIgStats().then(function (r) {
      return {
        'followers' : r['data']['counts']['followed_by'],
        'following' : r['data']['counts']['follows']
      };
    });
  };

  var _twitterFollow = function () {
    return getTwitterStats().then(function (r) {
      return {
        'followers' : r['followers']['data']['ids'].length,
        'following' : r['following']['data']['ids'].length
      };
    });
  };

  var _soundcloudFollow = function () {
    return getSoundcloudStats().then(function (r) {
      return {
        'followers' : r['data']['followers_count'],
        'following' : r['data']['followings_count']
      };
    });
  };

  var getFollowStats = function (mediaObj) {
    //mediaObj currently not functional

    // mediaObj = mediaObj || {
    //     twitter : true,
    //     soundcloud : true,
    //     instagram : true
    //   }

    return $q(function (resolve, reject) {
      var base = {};
      _instagramFollow(base)
        .then(function(ig){
            base['instagram'] = ig;
          _soundcloudFollow(base)
            .then(function(sc){
              base['soundcloud'] = sc;
              _twitterFollow(base)
                .then(function(tw){
                  base['twitter'] = tw;
                  resolve(base);
                })
                .catch(function(twitterErr){
                  base['twitter'] = null;
                  resolve(base);
                })
            })
            .catch(function(soundcloudErr){
              base['soundcloud'] = null;
              _twitterFollow()
                .then(function(tw){
                  base['twitter'] = tw;
                  resolve(base);
                })
                .catch(function(twitterErr){
                  base['twitter'] = null;
                  resolve(base);
                })
            })
        })
        .catch(function(igError){
          base['instagram'] = null;
          _soundcloudFollow(base)
            .then(function(sc){
              base['soundcloud'] = sc;
              _twitterFollow(base)
                .then(function(tw){
                  base['twitter'] = tw;
                  resolve(base);
                })
                .catch(function(twitterErr){
                  base['twitter'] = null;
                  resolve(base);
                })
            })
            .catch(function(soundcloudErr){
              base['soundcloud'] = null;
              _twitterFollow()
                .then(function(tw){
                  base['twitter'] = tw;
                  resolve(base);
                })
                .catch(function(twitterErr){
                  base['twitter'] = null;
                  resolve(base);
                })
            })

        })
    })
    .then(function (obj) {
      // console.log('from inside sliderFactory',obj);
      var arr = []
      for(var key in obj){
        // console.log(obj[key]);
        arr.push({media:key, counts: obj[key]})
      }
      console.log(arr);
      return arr;
    });
  };

    //   var base = {};
    //   _instagramFollow(base).then(function(ig){
    //       base['instagram'] = ig;
    //     _soundcloudFollow(base).then(function(sc){
    //       base['soundcloud'] = sc;
    //       _twitterFollow(base).then(function(tw){
    //         base['twitter'] = tw;
    //         resolve(base);
    //       });
    //     });
    //   });
    // })
    // .then(function (obj) {
    //   // console.log('from inside sliderFactory',obj);
    //   var arr = []
    //   for(var key in obj){
    //     // console.log(obj[key]);
    //     arr.push({media:key, counts: obj[key]})
    //   }
    //   console.log(arr);
    //   return arr;
    // });
  // };

  return {
    getSoundcloudStats : getSoundcloudStats,
    getIgStats : getIgStats,
    getTwitterStats : getTwitterStats,
    getFollowStats : getFollowStats
  };

}]);
