app.controller('FeedController', ['$scope', 'PanelFactory', 'RedditFactory','TwitterFactory', 'InstagramFactory', 'SoundCloudFactory', 'PostType', '$location', '$sce', '$timeout', 'UsersFactory', 
  function ( $scope, PanelFactory, RedditFactory, TwitterFactory, InstagramFactory, SoundCloudFactory, PostType, $location, $sce, $timeout, UsersFactory ) {

  $scope.feed = [];

  $scope.checked = PanelFactory;   // This will be binded using the ps-open attribute

  $scope.loader = false;

  angular.element(document).ready(function (arg) {
    $scope.loader = true;
  });



  var buildFeed = function (data, type, date) { 
    var theFeed  = [], 
       theDate, htmlFrame, obj;
    angular.forEach(data, function (item) {
      var append = true;
      if (type==='reddit') {
        console.log(item);
        if(item.url.endsWith('.jpg')){
          obj = {
            image_url : item.url.substring(5,item.length),
            type: 'reddit',
            title: item.title,
            raw_time: item.created_utc,
            created_at: new Date(item.created_utc * 1000),
            displayTime: moment(new Date(item.created_utc*1000)).fromNow()
          }
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
      append ? theFeed.push(obj) : null;
     
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
    console.log(localStorage.redditToggle);
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
        default:
          console.log('default');        
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
      'soundcloud': false,
      'reddit':false
    };
  })
  .factory('PanelFactory',[function ( ) {
    return {
      'checked': false
    };
  }])
  .filter('typeFilter', ['PostType', function (PostType) {
    return function ( input ) {
      var output = [];
      angular.forEach(input, function ( post ) {
        if ( PostType[post.type] === false) {
          if (post.type === 'instagram') {
            window.instgrm.Embeds.process();
          }
          output.push(post);
        }
      });
      return output;
    };
  }])
  .directive('poseidon', ['SliderFactory','$window', '$timeout',
  function (SliderFactory, $window, $timeout) {
    return {
      restrict: 'E',
      scope: {
      },
      link: function(scope, ele, attrs) {
        var dataset = [];
        var dataset2 = [];
        var dataset3 = [];
        var svg = d3.select(ele[0])
          .append('svg')
          .style({'width': '100%', 'height': '100%'});
        var colorObj = {
          'soundcloud': '#FF5500',
          'twitter': '#54aaec',
          'instagram': '#325C86'
        };
        SliderFactory.getFollowStats()
          .then(function(resp){
            angular.forEach(resp, function (i) {
              if (colorObj[i.media]) { colorObj[i.media][1]++; }
              if (i.counts) {
                dataset.push({ type: i.media, followers : i.counts.followers });
                dataset2.push({ type: i.media, following : i.counts.following });
              } 
            });
            for (var x in colorObj) {
              dataset3.push({ type: colorObj[x], count: colorObj[x]});
            }          
          })
          .then(function () {
            
            nv.addGraph(function() {
              
              var chart = nv.models.pieChart()
                  .x(function(d) { return d.type; })
                  .y(function(d) { return d.followers; })
                  .color(function (d) { return colorObj[d.type]; })
                  .showLegend(true)
                  .showLabels(false)     //Display pie labels
                  .labelThreshold(0.05)  //Configure the minimum slice size for labels to show up
                  .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                  .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                  .donutRatio(0.35);     //Configure how big you want the donut hole size to be.

                d3.select("#pie svg")
                    .datum(dataset)
                    .transition().duration(350)
                    .call(chart);
                  

              return chart;
            });
            nv.addGraph(function() {
              var chart2 = nv.models.pieChart()
                 .x(function(d) { return d.type; })
                 .y(function(d) { return d.following; })
                 .color(function(d){ return colorObj[d.type]; })
                 .showLegend(true)
                 .showLabels(false)    
                 .labelThreshold(0.05)  
                 .labelType("percent") 
                 .donut(true)          
                 .donutRatio(0.35);    

               d3.select("#pie2 svg")
                   .datum(dataset2)
                   .transition().duration(350)
                   .call(chart2);

             return chart2;
            });
            nv.addGraph(function() {
              var chart3 = nv.models.pieChart()
                 .x(function(d) { return d.type; })
                 .y(function(d) { return d.count; })
                 .color(function(d){ return colorObj[d.type]; })
                 .showLegend(true)
                 .showLabels(false)    
                 .labelThreshold(0.05)  
                 .labelType("percent") 
                 .donut(true)          
                 .donutRatio(0.35);    

              d3.select("#pie3 svg")
                 .datum(dataset3)
                 .transition().duration(350)
                 .call(chart3);

             return chart3;
            });
          });

        var imgs = svg.selectAll("image").data([0]);
                imgs.enter()
                .append("svg:image")
                .attr("xlink:href", "../static/views/ONE.png")
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", '100%')
                .attr("height", '150');

        scope.render = function(data) {
          svg.selectAll('*').remove();
        };
      }
    };
  }]);
