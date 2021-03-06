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
    d3.csv('air_quality.csv', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        data.forEach(function(d) {
            d.Emissions = d.Emissions
                            .replace(",", "");
            d.Emissions = +d.Emissions;
        });

        console.log('clean', data);

        // scales
        var x = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.State;
                })
            )
            .range([0, innerWidth])
            .padding(0.2);

        console.log(x.domain(), x.range());

        var cols = d3
              .scaleOrdinal()
              .domain(
                data.map(function(d){
                  return d.Region;
                })
              )
              .range(["pink", "#3cb44b", "#ffe119", "blue"]);

          console.log(cols.domain()[1]);

        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function(d) {
                    return d.Emissions;
                })
            ])
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // bars
        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) {
                return x(d.State);
            })
            .attr('y', function(d) {
                return y(d.Emissions);
            })
            .attr('width', x.bandwidth())
            .attr('height', function(d) {
                return innerHeight - y(d.Emissions);
                //return y(d.Emissions);
            })
            .attr('fill', function(d){
              return cols(d.Region);
            })
            .attr('stroke', 'none');

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('State');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Emissions');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Emissions by State');

    // adding in sort functionality
    d3.selectAll("input[name = 'button']").on("change", change);

     function change() {
         var x0 = x.domain(data.sort(this.value == "descending" ?
        (function(a, b) {
           return b.Emissions - a.Emissions;
            }) :
                ((this.value == "ascending") ?
        (function(a, b) {
            return a.Emissions - b.Emissions;
           }) :
        (function(a, b) {
             return d3.ascending(a.State, b.State);
           })))
           .map(function(d) {
               return d.State;
       }))
       .copy();

       svg.selectAll(".bar")
         .sort(function(a, b) {
           return x0(a.State) - x0(b.State);
         });
       var transition = svg.transition().duration(750),
         delay = function(d, i) {
           return i * 50;
         };
       transition.selectAll(".bar")
         .delay(delay)
         .attr("x", function(d) {
           return x0(d.State);
         });
       transition.select(".x-axis") //selects the x-axis
         .call(xAxis)
         .selectAll("g")
         .delay(delay);
  }



    });
}

buildChart('#chart-holder');
