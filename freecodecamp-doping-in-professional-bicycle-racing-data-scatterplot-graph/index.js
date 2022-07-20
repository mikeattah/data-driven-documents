async function draw() {
  // Data
  const data = await d3.json("data.json");

  // Formatters
  const timeFormatter = d3.timeFormat("%M:%S");
  const parseTime = d3.timeParse("%M:%S");

  // Accessor Functions
  const xAccessor = (d) => d.Year;
  const yAccessor = (d) => d.Seconds;
  const timeAccessor = (d) => d.Time;
  const nameAccessor = (d) => d.Name;
  const nationalityAccessor = (d) => d.Nationality;
  const dopingAccessor = (d) => d.Doping;

  // Dimensions
  let dimensions = {
    width: 1100,
    height: 900,
    margins: 75,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // SVG Image
  const svg = d3
    .select("#chart")
    .append("svg")
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
    .range([0, dimensions.ctrWidth])
    .clamp(true);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([0, dimensions.ctrHeight])
    .clamp(true);

  // Tooltip
  const tooltip = d3.select("#tooltip");

  // Circles
  ctr
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 6)
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("data-xvalue", (d) => xAccessor(d))
    .attr("data-yvalue", (d) => parseTime(timeAccessor(d)))
    .attr("fill", (d) => (dopingAccessor(d) === "" ? "#ff7f0e" : "#2463a5"))
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .classed("dot", true)
    .on("touchmouse mouseenter", function (e, datum) {
      // Tooltip
      tooltip
        .attr("data-year", datum.Year)
        .style("display", "block")
        .style("top", `${e.pageY - 275}px`)
        .style("left", xScale(xAccessor(datum)) - 38 + "px");

      tooltip.select(".athlete-name").text(nameAccessor(datum) + ": ");
      tooltip.select(".athlete-nationality").text(nationalityAccessor(datum));
      tooltip.select(".date-year").text(" " + xAccessor(datum) + ",");
      tooltip.select(".date-time").text(" " + timeAccessor(datum));
      tooltip.select(".description").text(dopingAccessor(datum));
    })
    .on("mouseleave", function () {
      d3.select(".dot-hovered").remove();
      tooltip.style("display", "none");
    });

  // Axes
  const xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d3.format("d"));
  const xAxisGroup = ctr
    .append("g")
    .attr("id", "x-axis")
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .classed("axis", true);
  xAxisGroup.call(xAxis);

  const yAxis = d3.axisLeft(yScale).tickFormat((d) => timeFormatter(d * 1000));
  const yAxisGroup = ctr.append("g").attr("id", "y-axis").classed("axis", true);
  yAxisGroup
    .append("text")
    .attr("x", -dimensions.margins * 1.6)
    .attr("y", -dimensions.margins + 25)
    .attr("fill", "black")
    .style("font-weight", "bold")
    .style("font-size", "2.0em")
    .style("text-anchor", "middle")
    .style("transform", "rotate(270deg)")
    .html("Time in Minutes");
  yAxisGroup.call(yAxis);
}

draw();
