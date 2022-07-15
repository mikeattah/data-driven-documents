async function draw() {
  // Data
  const data = await d3.json("data.json").then((data) => data.data);

  // Parse Date
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Format Date
  const dateFormatter = d3.timeFormat("%B %d, %Y");

  // Accessor Functions
  const xAccessor = (d) => parseDate(d[0]);
  const yAccessor = (d) => d[1];

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
    .scaleUtc()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.ctrWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.ctrHeight, 0])
    .nice();

  // Draw Bars
  ctr
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", dimensions.barWidth)
    .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
    .attr("x", (d) => xScale(xAccessor(d)))
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("data-date", (d) => dateFormatter(xAccessor(d)))
    .attr("data-gdp", (d) => yAccessor(d))
    .attr("fill", "#1ca8f8")
    .classed("bar", true)
    .on("touchmouse mouseenter", function (e, datum) {
      d3.select(this).attr("fill", "#c4d9eb");
      // Tooltip
      tooltip
        .style("display", "block")
        .style("top", `${e.pageY git add .- 300}px`)
        .style("left", xScale(xAccessor(datum)) + "px");

      // tooltip.append("g").attr("data-date", (d) => dateFormatter(xAccessor(d)));

      tooltip.select(".date-year").text("Year");
      tooltip.select(".date-qtr").text("Quarter");
      tooltip.select(".amount-figure").text("Figure");
      tooltip.select(".amount-type").text("Type");
    })
    .on("mouseleave", function () {
      d3.select(this).attr("fill", "#1ca8f8");
      tooltip.style("display", "none");
    });

  // Draw Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  ctr
    .append("g")
    .attr("id", "x-axis")
    .classed("tick", true)
    .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis);

  ctr.append("g").attr("id", "y-axis").classed("tick", true).call(yAxis);
}

draw();
