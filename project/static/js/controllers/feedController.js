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
  .directive('poseidon', ['SliderFactory','$window', '$timeout', 'd3Service', 
  function (SliderFactory, $window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
      },
      link: function(scope, ele, attrs) {
        var dataset = [];
        var svg = d3.select(ele[0])
          .append('svg')
          .style({'width': '100%', 'height': '100%'});


        SliderFactory.getFollowStats()
          .then(function(resp){
            for (var x in resp) {
              dataset.push({ type: resp[x].media, followers : resp[x].counts.followers, following : resp[x].counts.following });
            }
          })
          .then(function () {
            nv.addGraph(function() {
              var chart = nv.models.pieChart()
                  .x(function(d) { return d.type; })
                  .y(function(d) { return d.followers; })
                  .color(['#325C86', '#FF5500', '#54aaec'])
                  .showLabels(true)     //Display pie labels
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
            // var width = 200;
            // var height = 200;
            // var radius = Math.min(width, height) / 2;

            // var donutWidth = 15;

            // var legendRectSize = 18;
            // var legendSpacing = 4;

            // var color = d3.scale.ordinal()
            //   .range(['#325C86', '#FF5500', '#54aaec']);

            // var svg = d3.select("#pie")
            //   .append('svg')
            //   .attr('width', width)
            //   .attr('height', height)
            //   .append('g')
            //   .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

            // var arc = d3.svg.arc()
            //   .innerRadius(radius - donutWidth)
            //   .outerRadius(radius);

            // var pie = d3.layout.pie()
            //   .value(function (d) { return d.followers; })
            //   .sort(null);

            // var path = svg.selectAll('path')
            //   .data(pie(dataset))
            //   .enter()
            //   .append('path')
            //   .attr('d', arc)
            //   .attr('fill', function (d, i) {
            //     return color(d.data.type);
            //   })
            //   .on('mouseover', function () {
            //     d3.select(this).attr('opacity', 0.7);
            //   })
            //   .on('mouseleave', function () {
            //     d3.select(this).attr('opacity', 1);
            //   })
            //   .append("svg:title")
            //   .text(function (d) {
            //     return d.data.followers;
            //   });
              


            // var legend = svg.selectAll('.legend')
            //   .data(color.domain())
            //   .enter()
            //   .append('g')
            //   .attr('class', 'legend')
            //   .attr('transform', function (d, i) {
            //     var height = legendRectSize + legendSpacing;
            //     var offset = height * color.domain().length / 2;
            //     var horz = -2 * legendRectSize;
            //     var vert = i * height - offset;
            //     return 'translate(' + horz + ',' + vert + ')';
            //   });

            // legend.append('rect')
            //   .attr('width', legendRectSize)
            //   .attr('height', legendRectSize)
            //   .style('fill', color)
            //   .style('strole', color);

            // legend.append('text')
            //   .attr('x', legendRectSize + legendSpacing)
            //   .attr('y', legendRectSize - legendSpacing)
            //   .text(function (d) {return d; });
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