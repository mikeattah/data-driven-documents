async function draw() {
  // Data
  const data = await d3.json("data.json").then((data) => data.data);

  // Parse Date
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Format Date
  const dateFormatter = d3.timeFormat("%B %-d, %Y");

  // Accessor Functions
  const dateAccessor = (d) => parseDate(d[0]);
  const gdpAccessor = (d) => d[1];

  // Dimensions
  let dimensions = {
    width: 1100,
    height: 900,
    margins: 75,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;
  dimensions.barWidth = dimensions.ctrWidth / data.length;

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

  // Create Tooltip
  const tooltip = d3.select("#tooltip");

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, dateAccessor))
    .range([0, dimensions.ctrWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, gdpAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice();

  // Draw Bars
  ctr
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", dimensions.barWidth)
    .attr("height", (d) => dimensions.ctrHeight - yScale(gdpAccessor(d)))
    .attr("x", (d) => xScale(dateAccessor(d)))
    .attr("y", (d) => yScale(gdpAccessor(d)))
    .attr("fill", "#01c5c4")
    .on("touchmouse mouseenter", function (e, datum) {
        const bar = d3.select(this);
        bar.attr("opacity", 0.5)
      // Tooltip
      tooltip
        .style("display", "block")
        .style("top", `${e.pageY - 300}px`)
        .style("left", xScale(dateAccessor(datum)) + "px");

      tooltip.select(".date-year").text("Year");
      tooltip.select(".date-qtr").text("Quarter");
      tooltip.select(".amount-figure").text("Figure");
      tooltip.select(".amount-type").text("Type");
    })
    .on("mouseleave", function () {
      tooltip.style("display", "none");
    });

  // Draw Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  ctr
    .append("g")
    .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis);

  ctr.append("g").call(yAxis);
}

draw();
