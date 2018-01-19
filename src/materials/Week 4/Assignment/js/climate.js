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
        data.forEach(function(d) {
            d.temp = +d.temp;
            d.year = +d.year;
        });

        console.log('clean', data);

        // scales
        var y = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.year;
                })
            )
            .range([innerWidth, 0])
            .padding(0.3);

        console.log(y.domain(), y.range());

        var x = d3
            .scaleLinear()
            .domain([
              d3.min(data, function(d) {
                  return d.temp;
              }),
                d3.max(data, function(d) {
                    return d.temp;
                })
            ])
            .range([0, innerHeight]);

        console.log(x.domain(), x.range());

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(5);

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
              //  return x(d.temp);
                return 0;
            })
            .attr('y', function(d) {
                return y(d.year);
            })
            .attr('height', y.bandwidth())
            .attr('width', function(d) {
                return x(d.temp);
            })
            .attr('fill', function(d){
              if(d.year > 2010){
                return "red";
              } else if (d.year < 1890) {
                return "blue";
              } else if (d.year < 1900) {
                return "yellow";
              } else if (d.year < 1910) {
                return "pink";
              } else if (d.year < 1920) {
                return "purple";
              } else if (d.year < 1930) {
                return "brown";
              } else if (d.year < 1940) {
                return "orange";
              } else if (d.year < 1950) {
                return "violet";
              } else if (d.year < 1960) {
                return "#00FFFF";
              } else if (d.year < 1970) {
                return "#F5F5DC";
              } else if (d.year < 1980) {
                return "#D2691E";
              } else if (d.year < 1990) {
                return "#8B008B";
              } else if (d.year < 1990) {
                return "#8B008B";
              } else if (d.year < 2000) {
                return "#8FBC8F";
              } else {
                return "green";
              }
            })

            .attr('stroke', 'none');

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Temp');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -10)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Year');

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


// quantize scale --> split into 14 groups
