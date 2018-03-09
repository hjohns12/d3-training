function buildChart(containerId) {
    // size globals
    var width = 1000;
    var height = 1000;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

      // Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    // create svg element
    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var colors = (["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099"])

    // read in our data
    d3.csv('data/StateBikeData.csv', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        data.forEach(function(d) {
            d.pchange = +d.pchange;
            d.pchangeSnipped = d3.format('.4')(+d.pchange);
            d.range1 = +d.range6through10;
            d.range2 = +d.range11through15;
        });

        console.log('clean', data);

        // scales
        var y = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.LocationAbbr;
                })
            )
            .range([innerHeight, 0])
            .paddingOuter(3)
            .paddingInner(2);

        console.log(y.domain(), y.range());

        var cols = d3
              .scaleOrdinal()
              .domain(
                data.map(function(d){
                  return d.Region;
                })
              )
              .range(["pink", "#3cb44b", "#ffe119", "blue"]);

          console.log(cols.domain()[1]);

        var x = d3
            .scaleLinear()
            .domain(d3.extent(data, function(d){
                return d.pchange;
            }))
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y);

        g
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate('+ x(0) +',0)')
            .call(yAxis)
            .selectAll("text")
            .remove();

        // bars
        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', function(d) {
                return y(d.LocationAbbr);
            })
            .attr('x', function(d) {
                return x(Math.min(0, d.pchange));
            })
            .attr('height', 5)
            .attr('stroke', 'none')
            .attr('width', function(d) {
                return Math.abs(x(d.pchange)-x(0));
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.LocationDesc + "<br/>"  + d.pchangeSnipped + "%")
                    .style("left", (d3.event.pageX) + "px") //hmm. not sure why this isn't working.
                    .style("top", (d3.event.pageY - 28) + "px");
                })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2.5)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('% change, 2006-2015');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 3)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Change in Percentage of Bike Communters by State: 2006-2015');

        // state name labels
        g
            .selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('y', function(d) {
                return y(d.LocationAbbr);
            })
            .attr('x', function(d) {
                 if (d.pchange > 0) {
                     return x(-1);
                 } else {
                     return x(.25);
                 }
            })
            .attr('dominant-baseline', 'hanging')
            .style('font-size', 12)
            .text(function(d) {
                return d.LocationAbbr;
            });

            // adding in sort functionality
            d3.selectAll("input[name = 'button']").on("change", change);

             function change() {

                 var x0 = y.domain(data.sort(this.value == "descending" ?
                (function(a, b) {
                   return b.pchange - a.pchange;
                    }) :
                        ((this.value == "ascending") ?
                (function(a, b) {
                    return a.pchange - b.pchange;
                   }) :
                (function(a, b) {
                     return d3.ascending(a.LocationAbbr, b.LocationAbbr);
                   })))
                   .map(function(d) {
                       return d.LocationAbbr;
               }))
               .copy();

               svg.selectAll(".bar")
                 .sort(function(a, b) {
                   return x0(a.LocationAbbr) - x0(b.LocationAbbr);
                 });


               var transition = svg.transition().duration(750),
                 delay = function(d, i) {
                   return i * 50;
                 };

               transition.selectAll(".bar")
                 .delay(delay)
                 .attr("y", function(d) {
                   return x0(d.LocationAbbr);
                 });


               transition.selectAll(".label") //selects the y-axis label
                .delay(delay)
               .attr("y", function(d) {
                     return x0(d.LocationAbbr);
                   });
          }


    });


}

buildChart('#chart-holder');
