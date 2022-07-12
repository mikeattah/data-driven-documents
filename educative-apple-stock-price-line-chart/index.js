// Source: https://www.educative.io/courses/master-d3-data-visualization
async function draw() {
  // Data
  const data = await d3.csv("data.csv");

  // Parse Date
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Format Date
  const dateFormatter = d3.timeFormat("%B %-d, %Y");

  // Accessor Functions
  const xAccessor = (d) => parseDate(d.date);
  const yAccessor = (d) => parseInt(d.close);

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 50,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // Create SVG Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Create Chart Container
  const ctr = svg
    .append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

  // Create Tooltip
  const tooltip = d3.select("#tooltip");

  // Create Tooltip Dot
  const tooltipDot = ctr
    .append("circle")
    .attr("r", 5)
    .attr("fill", "#fc8781")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .style("opacity", 0)
    .style("pointer-events", "none");

  // Scales
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.ctrWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice();

  // Line Generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  // Draw Line
  ctr
    .append("path")
    .datum(data)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#30475e")
    .attr("stroke-width", 2);

  // Axes
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => `$${d}`);

  ctr.append("g").call(yAxis).classed("axis", true);

  const xAxis = d3.axisBottom(xScale);

  ctr
    .append("g")
    .call(xAxis)
    .classed("axis", true)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`);

  // Draw Chart Container Overlay
  ctr
    .append("rect")
    .style("opacity", 0)
    .attr("width", dimensions.ctrWidth)
    .attr("height", dimensions.ctrHeight)
    .on("touchmouse mousemove", function (e) {
      const mousePos = d3.pointer(e, this);
      const date = xScale.invert(mousePos[0]);

      // Custom Bisector - left, center, right
      const weatherBisect = d3.bisector(xAccessor).left;
      const index = weatherBisect(data, date);
      const weather = data[index - 1];

      // Update Tooltip Dot
      tooltipDot
        .style("opacity", 1)
        .attr("cx", xScale(xAccessor(weather)))
        .attr("cy", yScale(yAccessor(weather)))
        .raise();

      // Update Tooltip
      tooltip
        .style("display", "block")
        .style("top", `${yScale(yAccessor(weather)) - 45}px`)
        .style("left", `${xScale(xAccessor(weather)) - 40}px`);

      tooltip.select(".price").text(`$${yAccessor(weather)}`);

      tooltip.select(".date").text(dateFormatter(xAccessor(weather)));
    })
    .on("mouseleave", function (e) {
      tooltipDot.style("opacity", 0);
      tooltip.style("display", "none");
    });
}

draw();
