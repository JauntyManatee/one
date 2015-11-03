app.directive('poseidon', ['SliderFactory','$window', '$timeout',
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
          'soundcloud': ['#FF5500', 0],
          'twitter': ['#54aaec', 0],
          'instagram': ['#325C86', 0]
        };
        SliderFactory.getFollowStats()
          .then(function(resp){
            var totsFollowers = 0; 
            var totsFollowing = 0;
            angular.forEach(resp, function (i) {
              if (colorObj[i.media]) { colorObj[i.media][1]++; }
              if (i.counts) {
                totsFollowing += i.counts.following;
                totsFollowers += i.counts.followers;
                dataset.push({ type: i.media, followers : i.counts.followers });
                dataset2.push({ type: i.media, following : i.counts.following });
              } 
            });
            dataset3.push({type: 'Total Followers', count : totsFollowers});
            dataset3.push({type: 'Total Following', count : totsFollowing});         
          })
          .then(function () {
            
            nv.addGraph(function() {
              
              var chart = nv.models.pieChart()
                  .x(function(d) { return d.type; })
                  .y(function(d) { return d.followers; })
                  .color(function (d) { return colorObj[d.type][0]; })
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
                  
              chart.valueFormat(d3.format('d'));
              return chart;
            });
            nv.addGraph(function() {
              var chart2 = nv.models.pieChart()
                 .x(function(d) { return d.type; })
                 .y(function(d) { return d.following; })
                 .color(function(d){ return colorObj[d.type][0]; })
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
              chart2.valueFormat(d3.format('d'));
              return chart2;
            });
            nv.addGraph(function() {
              var chart3 = nv.models.pieChart()
                 .x(function(d) { return d.type; })
                 .y(function(d) { return d.count; })
                 // .color(function(d){ return colorObj[d.type][0]; })
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
              chart3.valueFormat(d3.format('d'));
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