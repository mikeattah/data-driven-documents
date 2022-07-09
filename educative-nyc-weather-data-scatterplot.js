async function draw() {
  // Data
  const data = await d3.json("educative-nyc-weather-data-scatterplot.json");

  // Accessor Functions
  // x/y humidity/apparentTemperature
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  // Dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.ctrWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.ctrHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Create SVG element and set the dimensions of the canvas
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Create container for the chart
  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  // Create tooltip
  const tooltip = d3.select("#tooltip");

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .rangeRound([0, dimensions.ctrWidth]) // round range to nearest integer
    .clamp(true);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice() // round domain to nearest whole number
    .clamp(true);

  // Draw circles
  ctr
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("data-temp", yAccessor)
    .attr("r", 5)
    .attr("fill", "red");

  // Axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(5)
    .tickFormat((d) => d * 100 + "%");

  const xAxisGroup = ctr
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .classed("axis", true);

  xAxisGroup
    .append("text")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity")
    .style("text-anchor", "middle");

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = ctr.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.ctrHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Temperature (&deg;F)")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)");

  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );

  const voronoi = delaunay.voronoi();
  voronoi.xmax = dimensions.ctrWidth;
  voronoi.ymax = dimensions.ctrHeight;

  // Draw Partitions
  ctr
    .append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    // .attr("stroke", "black")
    .attr("fill", "transparent")
    .attr("d", (d, i) => voronoi.renderCell(i))
    .on("mouseenter", function (e, datum) {
      ctr
        .append("circle")
        .classed("dot-hovered", true)
        .attr("fill", "#120078")
        .attr("r", 8)
        .attr("cx", xScale(xAccessor(datum)))
        .attr("cy", yScale(yAccessor(datum)))
        .style("pointer-events", "none");

      tooltip
        .style("display", "block")
        .style("top", yScale(yAccessor(datum)) - 25 + "px")
        .style("left", xScale(xAccessor(datum)) + "px");

      // formatters
      const numberFormatter = d3.format(".2f");
      const dateFormatter = d3.timeFormat("%B %-d, %Y");

      tooltip
        .select(".metric-humidity span")
        .text(numberFormatter(xAccessor(datum)));

      tooltip
        .select(".metric-temp span")
        .text(numberFormatter(yAccessor(datum)));

      tooltip
        .select(".metric-date")
        .text(dateFormatter(datum.currently.time * 1000));
    })
    .on("mouseleave", function () {
      d3.select(".dot-hovered").remove();

      tooltip.style("display", "none");
    });
}

draw();
