app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', '$sce', '$timeout', function ( $scope, TwitterFactory, InstagramFactory, SoundCloudFactory, $sce, $timeout ) {
  var buildFeed = function (data, type, date) { 
    var theFeed  = [], 
        theDate, htmlFrame, obj;
    angular.forEach(data, function (item) {
      if (type === 'twitter') {
        obj = {
          text : item.text, 
          created_at: new Date(item.created_at), 
          type: type, 
          user: {screen_name : item.user.screen_name}, 
          id_str: item.id_str 
        };
      } else {
        htmlFrame = $sce.trustAsHtml(item.embed);
        theDate = date ? new Date(item.time * 1000) : new Date(item.time);
        obj = {
          frame: htmlFrame, 
          created_at: theDate, 
          type: type
        };
      }
      theFeed.push(obj);
    });
    return theFeed;
  };

  $scope.feed = [];

  $scope.postType = {
    'twitter': false,
    'instagram': false,
    'soundcloud': false
  };

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      if(Array.isArray(data.data)){
        var items = buildFeed(data.data, 'twitter');
        $scope.feed.push.apply($scope.feed, items);
      }
    });
  };

  $scope.favTweet = function ( id ) {
    TwitterFactory.favTweet(id).then(function ( response ) {
      console.log(response);
    });
  };

  $scope.reTweet = function ( id ) {
    TwitterFactory.reTweet(id).then(function ( response ) {
      console.log(response);
    });
  };

  $scope.getInstaFeed = function ( ) {
    InstagramFactory.getInstaFeed().then(function ( data ) {
      var items = buildFeed(data.data.data, 'instagram', true);
      $scope.feed.push.apply($scope.feed, items);
      console.log($scope.feed);
    });
  };

  $scope.getSoundFeed = function () {
    SoundCloudFactory.getSongs().then(function (data) {
      var items = buildFeed(data.data.data, 'soundcloud');
      $scope.feed.push.apply($scope.feed, items);
    });
  };
}])
.filter('typeFilter', function ( ) {
  return function ( input, postTypes ) {
    var output = [];

    angular.forEach(input, function ( post ) {
      if ( postTypes[post.type] === false) {
        if (post.type === 'instagram') {
          window.instgrm.Embeds.process();
        }
        output.push(post);
      }
    });
    return output;
  };

});
