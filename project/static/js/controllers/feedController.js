app.controller('FeedController', ['$scope', 'PanelFactory', 'RedditFactory','TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', 'PostType', '$location', '$sce', '$timeout', 'UsersFactory', 
  function ( $scope, PanelFactory, RedditFactory, TwitterFactory, InstagramFactory, SoundCloudFactory, PostType, $location, $sce, $timeout, UsersFactory ) {

  $scope.feed = [];

  $scope.checked = PanelFactory;   // This will be binded using the ps-open attribute

  $scope.postType = PostType;

  $scope.loader = false;

  angular.element(document).ready(function (arg) {
    $scope.loader = true;
  });

  var buildFeed = function (data, type, date) { 
    var theFeed  = [], 
       theDate, htmlFrame, obj;
    angular.forEach(data, function (item) {
      var append = true;
      if (type === 'reddit') {
        if(item.url.endsWith('.jpg')) {
          obj = {
            image_url : item.url.substring(5,item.length),
            type: 'reddit',
            title: item.title,
            raw_time: item.created_utc,
            created_at: new Date(item.created_utc * 1000),
            displayTime: moment(new Date(item.created_utc*1000)).fromNow(),
            url: 'http://reddit.com'+ item.permalink
          };
        }
        else{
          append = false;
        }
      } else if (type === 'twitter') {
        obj = {
         text : item.text, 
         created_at: new Date(item.created_at),
         displayTime: moment(new Date(item.created_at)).fromNow(), 
         type: type, 
         user: {screen_name : item.user.screen_name}, 
         id_str: item.id_str 
        };
      } else if(type === 'instagram' || type === 'soundcloud'){
        if(item.embed){
          htmlFrame = $sce.trustAsHtml(item.embed);
          theDate = date ? new Date(item.time * 1000) : new Date(item.time);
          obj = {
           frame: htmlFrame, 
           created_at: theDate,
           displayTime: moment(theDate).fromNow(), 
           type: type
          };
        }else{
          append = false;
        }
      } 
      append ? theFeed.push(obj) : null;
     
    });
    return theFeed;
  };

  $scope.isValidUser = function () {
    var user = localStorage.getItem('at');
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

  $scope.postTweet = function ( tweet ) {
    var array = tweet.split("");
    for (var i = 0; i < array.length; i++) {
      switch(array[i]) {
        case ' ':
          array[i] = '%20';
          break;
        case '@':
          array[i] = '%40';
          break;
        case '#':
          array[i] = '%23';
          break;
        case '&':
          array[i] = '%26';
          break;
        case ':':
          array[i] = '&3A';
          break;
        case '/':
          array[i] = '%2F';
          break;
        default:
          array[i] = array[i];
      }
      // space as %20
      // @ as %40
      // # as %23
      // & as %26
      // colon as %3A
      // forward slash as %2F
    }
    tweet = array.join("");
    TwitterFactory.postTweet( tweet ).then(function ( response ) {
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
  
  $scope.getRedditFeed = function ( ) {
    if(localStorage.redditToggle){
      RedditFactory.getRedditFeed().then(function (data) {
        if(Array.isArray(data.data)){
          var items = buildFeed(data.data, 'reddit');
          $scope.feed.push.apply($scope.feed, items);
        }
      });
    }
  };

  $scope.toggle = function( type ) {
    var beenCalled = false;

    if(type === 'reddit' && RedditFactory.redditToggle === false){
      RedditFactory.redditToggle = true;
    }
    angular.forEach($scope.feed, function ( post ) {
      if(post.type === type) {
        beenCalled = true;
      }
    });

    if (beenCalled === true) {  
      PostType[type] = !PostType[type];
    } else {
      var seshToken = localStorage.getItem('at');
      switch(type) {
        case 'twitter':
          window.location.href = '/activate';
          break;
        case 'instagram':
          window.location.href = '/igAuth';
          break;
        case 'soundcloud':
          window.location.href = '/sound';
          break;
        case 'reddit':
          localStorage.redditToggle = true;
          $scope.getRedditFeed();
          break;        
      }
    }
  };

  $scope.refreshFeed = function ( ) {
    window.history.go(0);
  };

  $scope.panelToggle = function(){
    PanelFactory.checked = !PanelFactory.checked;
  };

  $scope.logout = function() {
    var authToken = localStorage.getItem('at');
    UsersFactory.logout({"at": authToken})
    .then(function ( res ) {
      localStorage.clear();
      $location.path('home');
    })
    .catch(function ( error ) {
      console.log(error);
    });
  };
 }]);
  
