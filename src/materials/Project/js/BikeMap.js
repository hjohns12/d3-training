
// set global width and height
var width = 1000;
var height = 500;

// US Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])
				   .scale([1000]);

// path generator
var path = d3.geo.path()
		  	 .projection(projection);


//  linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(255,51,51)","rgb(0,204,0)","rgb((0,102,0))"]);

var legendText = ["City in Top 10", "Rising rate of bike commuters", "Falling rate of bike commuters", "No change"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in state data
d3.csv("data/statesChange.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("data/us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].state;

	// Grab data value
	var dataValue = data[i].change;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.change = dataValue;

		// Stop looking through the JSON
		break;
		}
	}
}

svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.change;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});

// Map the top 10 cities for biking
d3.csv("data/biking-cities.csv", function(data) {

svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.lon, d.lat])[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(d.pBike) * 5;
	})
		.style("fill", "rgb(0,102,0)")
		.style("opacity", 0.85)

// get tooltip to hover above city, w name and percentage
	.on("mouseover", function(d) {
    	div.transition()
      	   .duration(200)
           .style("opacity", .9);
           div.html(d.place + " bike commuting rate: " + d.pBike + "%")
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
	})

});

// code from http://bl.ocks.org/mbostock/3888852
var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 200)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});
