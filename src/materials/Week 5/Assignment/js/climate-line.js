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

    // read in our data
    d3.json('climate.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        var parseTime = d3.timeParse('%Y');

        // coerce data to numeric
        data.forEach(function(d) {
            d.temp = +d.temp;
            d.date = parseTime((+d.year).toString());
        });

        console.log('clean', data);

        // scales
        var y = d3
            .scaleLinear()
            .domain([
              d3.min(data, function(d){
                return d.temp;
              }) +-.2,
              d3.max(data, function(d){
                return d.temp;
              }) + .2

            ])
            .range([innerHeight, 0])
            //.padding(0.3);

        console.log(y.domain(), y.range());

        var x = d3
            .scaleTime()
            .domain(
              d3.extent(data, function(d) {
                  return d.date;
              })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight/1.555 + ')')        // possibly the hackiest way possible to get x-axis at y0. come back and fix

            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);


        // make line
        var line = d3
              .line()
              .x(function(d){
                return x(d.date);
              })
              .y(function(d){
                return y(d.temp);
              });

        g
            .append('path')
            .datum(data)
            .attr('class', 'temp-line')
            .attr('fill', 'none')
            .attr('stroke', 'green')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        // put points on the line
        g
            .selectAll('.spot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', '.spot')
            .attr('fill', 'green')
            .attr('stroke', 'none')
            .attr('cx', function(d){
              return x(d.date);
            })
            .attr('cy', function(d){
              return y(d.temp);
            })
            .attr('r', 3);


        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Year');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -10)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Temp change');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Temperature Changes: 1880 to 2016');
    });
}

buildChart('#chart-holder');
