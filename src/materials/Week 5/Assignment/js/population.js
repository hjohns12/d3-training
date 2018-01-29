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
    d3.json('population.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);

        // coerce data to numeric
        // coerce data to numeric
       var parseTime = d3.timeParse("%B-%Y");
       data.forEach(function(d) {
           d.pop = +d.pop
           d.date = parseTime(d.year);
       });
       console.log('clean', data);
       // scales
       var x = d3
           .scaleTime()
           .domain(
               d3.extent(data, function(d) {
                   return d.date;
               })
           )
           .range([0, innerWidth]);
       console.log(x.domain(), x.range());


       var y = d3
           .scaleLinear()
                   .domain([
                       0,
                       d3.max(data, function(d) {
                           return d.pop / 1000000;
                       })
                   ])
           .range([innerHeight, 0]);
       console.log(y.domain(), y.range());


       // axes
       var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(10));
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


       // line generator
       var line = d3
           .line()
           .x(function(d) {
               return x(d.date);
           })
           .y(function(d) {
               return y(d.pop / 1000000);
           })
           .defined(function(d) {
              return d.date.getFullYear() !== 2017;
           });


       // multiple lines
       var countries = ['China', 'India'];
       var myColors = ["blue", "green"];

       var colorScale = d3
           .scaleOrdinal(myColors)
           .domain(countries);

       var groups = g
           .selectAll('.country-list')
           .data(countries)
           .enter()
           .append('g')
           .attr('class', 'country-list');


       groups
           .append('path')
           .datum(function(d) {
               return data.filter(function(r) {
                   return r.country === d;
               });
           })
           .attr('class', 'pop-line')
           .attr('fill', 'none')
           .attr('stroke', function(d) {
               return colorScale(d[0].country);
           })
           .attr('stroke-width', 1.5)
           .attr('d', line);


       groups
           .selectAll('.pop-point')
           .data(function(d) {
               return data.filter(function(r) {
                   return r.country === d;
               });
           })
           .enter()
           .append('circle')
           .attr('class', 'pop-point')
           .attr('fill', function(d) {
               return colorScale(d.country);
           })
           .attr('stroke', 'none')
           .attr('cx', function(d) {
               return x(d.date);
           })
           .attr('cy', function(d) {
               return y(d.pop / 1000000);
           })
           .attr('r', 2);

       //legend
       groups
           .append('circle')
           .datum(function(d) {
               return data.filter(function(r) {
                   return r.country === d;
               });
           })
           .attr('class', 'legend-color')
           .attr('r', 6)
           .attr('cx', 100)
           .attr('cy', (d, i) => 16 * i)
           .attr('fill', function(d) {
               return colorScale(d[0].country);
           })
           .attr('stroke', 'none');

       groups
           .append('text')
           .datum(function(d) {
               return data.filter(function(r) {
                   return r.country === d;
               });
           })
           .attr('class', 'legend-label')
           .attr('x', 112)
           .attr('y', (d, i) => 16 * i)
           .attr('text-anchor', 'start')
           .attr('dominant-baseline', 'central')
           .style('font-size', 12)
           .text(function(d) {
               return d[0].country;
           });


       // axis labels
       g
           .append('text')
           .attr('class', 'x-axis-label')
           .attr('x', innerWidth / 2)
           .attr('y', innerHeight + 30)
           .attr('text-anchor', 'middle')
           .attr('dominant-baseline', 'hanging')
           .text('Year');

       g
           .append('text')
           .attr('class', 'y-axis-label')
           .attr('x', -30)
           .attr('y', innerHeight / 2 - 5)
           .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
           .attr('text-anchor', 'middle')
           .attr('dominant-baseline', 'baseline')
           .text('Population (millions)');

       // title
       g
           .append('text')
           .attr('class', 'title')
           .attr('x', innerWidth / 2)
           .attr('y', -20)
           .attr('text-anchor', 'middle')
           .attr('dominant-baseline', 'baseline')
           .style('font-size', 24)
           .text('Country Populations by Year');
   });
}

buildChart('#chart-holder');
