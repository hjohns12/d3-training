function buildChart(containerId) {
    // size globals
    var width = 1000;
    var height = 1000;

    var margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
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

    // this function serves to filter by state
    function filtercsv(csv, key, value) {
      var result = [];
      //could also use filter
      csv.forEach(function(val, idx, arr){
        if(val[key] == value){

          result.push(val)
        }
      })
      return result;
    }

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // read in bike data
    d3.csv('data/longBikes.csv', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('raw', data);


        data.forEach(function(d) {
            d.value = +d.Data_Value;
            d.Year = +d.YearStart;
        });

        console.log('clean', data);

        // scales
        var x = d3
            .scaleLinear()
            //.scaleBand()
            .domain(
                d3.extent(data, function(d) {
                    return d.Year;
                })
            )
            .range([0, innerWidth]);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain(
                d3.extent(data, function(d) {
                    return d.value;
                })
            )
            .range([innerHeight, 0]);

        console.log(y.domain(), y.range());

        // axes
        var xAxis = d3.axisBottom(x).ticks(4).tickFormat(d3.format("d"));

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, '+ y(0) +')')
            .call(xAxis)
            .selectAll('text')
        //    .attr('dy', '40em')
            .attr('dx', '-1em')
            .style('text-anchor', 'start')
            .style('font-size', 10);

        // g
        //     .append('g')
        //     .attr('class', 'x-axis')
        //     .attr('transform', 'translate(0, '+ y(0) +')')
        //     .call(xAxis);

        g
            .select('text') // selects text nearest y-axis
            .attr('dy', '-1em'); // shifts text away from y-axis

        var yAxis = d3.axisLeft(y).ticks(25);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // line generator
        var line = d3
            .line()
            .x(function(d) {
                return x(d.Year);
            })
            .y(function(d) {
                return y(d.value);
            });

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
                .attr('x', -30)
                .attr('y', innerHeight / 2)
                .attr('transform', 'rotate(-90,-40,' + innerHeight / 2 + ')')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .text('Percent Biking to Work');

            // title
            g
                .append('text')
                .attr('class', 'title')
                .attr('x', innerWidth / 2)
                .attr('y', -20)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'baseline')
                .style('font-size', 24)
                .text('Biking to Work by State');

            d3.select("#inds")
                .on("input", function(){
                    var chosenState = this.value;
                    drawGraph(chosenState);
                })

        drawGraph("US");



function drawGraph(state){
    console.log(state);
        // add line
        var selection =  g
            .selectAll('.bike-line')
            .data([filtercsv(data, "LocationAbbr", state)])
            console.log(filtercsv(data, "LocationAbbr", state));

        selection
            .enter()
            .append('path')
            .attr('class', 'bike-line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        selection
            // add transition
            .transition()
            .duration(2000)
            .attr('d', line);
};

    });
}

buildChart('#chart-holder');
