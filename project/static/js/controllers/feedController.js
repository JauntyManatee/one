app.controller('FeedController', ['$scope', 'TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', '$sce', '$timeout', function ( $scope, TwitterFactory, InstagramFactory, SoundCloudFactory, $sce, $timeout ) {

  $scope.feed = [];

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      if(Array.isArray(data.data)){
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].created_at = new Date(data.data[i].created_at);
          data.data[i].twitter = true;
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
      $timeout(function(){
          window.instgrm.Embeds.process();
        });
      // $scope.htmlSafe = $sce.trustAsHtml(data.data.data[0].embed);
      var items = [];
      for (var i = 0; i < iFrame.length; i++) {
        var htmlFrame= $sce.trustAsHtml(iFrame[i].embed);
        var theDate = new Date(iFrame[i].time * 1000);
        items.push({frame: htmlFrame, created_at: theDate, instagram: true});
      }
      $scope.feed.push.apply($scope.feed, items);
      console.log($scope.feed);
      // if(typeof data.data !== 'string') {
      //   for (var i = 0; i < data.data.data.length; i++) {
      //     var theDate = new Date(data.data.data[i].created_time*1000);
      //     data.data.data[i].created_at = theDate;
      //     data.data.data[i].instagram = true;
      //   }
      //   $scope.feed.push.apply($scope.feed, data.data.data);
      //   console.log($scope.feed);
      // }
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
        items.push({frame: htmlFrame, created_at: theDate, soundcloud: true});
      }
      $scope.feed.push.apply($scope.feed, items);
      console.log($scope.feed);
    });
  };
}]);