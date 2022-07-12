// Source: https://www.educative.io/courses/master-d3-data-visualization
async function draw() {
  // Data
  const data = await d3.json("data.json");

  // Accessor Functions
  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.currently.apparentTemperature;

  // Dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margins: 50,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // SVG Image
  const svg = d3
    .select("#chart")
    .append("svg")
    // .attr("width", dimensions.width)
    // .attr("height", dimensions.height)
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

  // Chart Container
  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

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

  // Circles
  ctr
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("data-temp", yAccessor)
    .attr("r", 5)
    .attr("fill", "red");

  // Tooltip
  const tooltip = d3.select("#tooltip");
  const arrow = tooltip.append("div").classed("arrow", true);

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
    .attr("y", dimensions.margins - 10)
    .attr("fill", "black")
    .text("Humidity")
    .style("text-anchor", "middle");

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = ctr.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.ctrHeight / 2)
    .attr("y", -dimensions.margins + 15)
    .attr("fill", "black")
    .html("Temperature (&deg;F)")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)");

  // Voronoi Diagrams
  const delaunay = d3.Delaunay.from(
    data,
    (d) => xScale(xAccessor(d)),
    (d) => yScale(yAccessor(d))
  );

  const voronoi = delaunay.voronoi();
  voronoi.xmax = dimensions.ctrWidth;
  voronoi.ymax = dimensions.ctrHeight;

  // Voronoi Partitions
  ctr
    .append("g")
    .selectAll("path")
    .data(data)
    .join("path")
    // .attr("stroke", "black")
    .attr("fill", "transparent")
    .attr("d", (d, i) => voronoi.renderCell(i))
    .on("mouseenter", function (e, datum) {
      // Append Overlapping Circles
      ctr
        .append("circle")
        .classed("dot-hovered", true)
        .attr("fill", "#120078")
        .attr("r", 8)
        .attr("cx", xScale(xAccessor(datum)))
        .attr("cy", yScale(yAccessor(datum)))
        .style("pointer-events", "none");

      // formatters
      const numberFormatter = d3.format(".2f");
      const dateFormatter = d3.timeFormat("%B %-d, %Y");

      // Tooltip
      tooltip
        .style("display", "block")
        .style("top", yScale(yAccessor(datum)) - 55 + "px")
        .style("left", xScale(xAccessor(datum)) - 27 + "px");

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
