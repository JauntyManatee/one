app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', '$sce', '$timeout', 'UsersFactory', function ( $scope, TwitterFactory, InstagramFactory, SoundCloudFactory, $sce, $timeout, UsersFactory ) {

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
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].created_at = new Date(data.data[i].created_at);
          data.data[i].type = 'twitter';
        }
        $scope.feed.push.apply($scope.feed, data.data);
        console.log($scope.feed);
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
      var iFrame = data.data.data;
      console.log(iFrame[0].embed);
      // $scope.htmlSafe = $sce.trustAsHtml(data.data.data[0].embed);
      // $timeout(function(){
      //   window.instgrm.Embeds.process();
      // });
      var items = [];
      for (var i = 0; i < iFrame.length; i++) {
        var htmlFrame= $sce.trustAsHtml(iFrame[i].embed);
        var theDate = new Date(iFrame[i].time * 1000);
        items.push({frame: htmlFrame, created_at: theDate, type: 'instagram'});
      }
      $scope.feed.push.apply($scope.feed, items);
      console.log($scope.feed);
    });
  };

  $scope.getSoundFeed = function () {
    
    SoundCloudFactory.getSongs().then(function (data) {
      var iFrame = data.data.data;
      // $scope.htmlSafe = $sce.trustAsHtml(data.data.data[0].embed);
      var items = [];
      for (var i = 0; i < iFrame.length; i++) {
        var htmlFrame= $sce.trustAsHtml(iFrame[i].embed);
        var theDate = new Date(iFrame[i].time);
        items.push({frame: htmlFrame, created_at: theDate, type: 'soundcloud'});
      }
      $scope.feed.push.apply($scope.feed, items);
      console.log($scope.feed);
    });
  };

  $scope.logout = function() {
    UsersFactory.logout();
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


