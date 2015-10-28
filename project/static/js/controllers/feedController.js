app.controller('FeedController', ['$scope', 'PanelFactory', 'TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', 'PostType', '$location', '$sce', '$timeout', 'UsersFactory', 
  function ( $scope, PanelFactory, TwitterFactory, InstagramFactory, SoundCloudFactory, PostType, $location, $sce, $timeout, UsersFactory ) {

  $scope.feed = [];

  $scope.postType = PostType;

  $scope.checked = PanelFactory;   // This will be binded using the ps-open attribute

  var buildFeed = function (data, type, date) { 
    var theFeed  = [], 
        theDate, htmlFrame, obj;
    angular.forEach(data, function (item) {
      if (type === 'twitter') {
        obj = {
          text : item.text, 
          created_at: new Date(item.created_at),
          displayTime: moment(new Date(item.created_at)).fromNow(), 
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
          displayTime: moment(theDate).fromNow(), 
          type: type
        };
      }
      theFeed.push(obj);
    });
    return theFeed;
  };

  $scope.isValidUser = function () {
    var user = sessionStorage.getItem('at');
    if (!user) {
      $location.path('home');
    } else {
      return true;
    }    
  };

  $scope.getTweets = function ( ) {
    TwitterFactory.getTweets().then(function ( data ) {
      if(Array.isArray(data.data)){
        var items = buildFeed(data.data, 'twitter');
        $scope.feed.push.apply($scope.feed, items);
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
      var items = buildFeed(data.data.data, 'instagram', true);
      $scope.feed.push.apply($scope.feed, items);
      if(data.data.is_more_data) {
        $scope.getInstaFeed();
      }
    });
  };

  $scope.getSoundFeed = function ( ) {
    SoundCloudFactory.getSongs().then(function (data) {
      var items = buildFeed(data.data.data, 'soundcloud');
      $scope.feed.push.apply($scope.feed, items);
      if(data.data.is_more_data) {
        $scope.getSoundFeed();
      }
    });
  };

  $scope.postType = PostType;

  $scope.toggle = function( type ) {
    $scope.postType[type] = !$scope.postType[type];
    return $scope.postType;
  };

  $scope.panelToggle = function(){
    PanelFactory.checked = !PanelFactory.checked;
  };

  $scope.logout = function() {
    var authToken = sessionStorage.getItem('at');
    UsersFactory.logout({"at": authToken})
    .then(function ( res ) {
      sessionStorage.clear();
      $location.path('home');
    })
    .catch(function ( error ) {
      console.log(error);
    });
  };

}])
.factory('PostType', function ( ) {
  return {
    'twitter': false,
    'instagram': false,
    'soundcloud': false
  };
})
.factory('PanelFactory',[function ( ) {
  return {
    'checked': false
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
})
.directive('poseidon', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
      },
      link: function(scope, ele, attrs) {
      
        var svg = d3.select(ele[0])
          .append('svg')
          .style({'width': '100%', 'height': '100%'});

        var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", "../static/views/ONE.png")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", '100%')
                .attr("height", '795');

        // scope.render = function(data) {
        //   svg.selectAll('*').remove();
        // };

      }
    };
}]);




