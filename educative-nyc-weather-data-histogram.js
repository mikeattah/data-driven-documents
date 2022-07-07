async function draw() {
  // Data
  const data = await d3.json("educative-nyc-weather-data-histogram.json");

  const xAccessor = (d) => d.currently.humidity;
  const yAccessor = (d) => d.length;

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50,
    padding: 1,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.ctrWidth])
    .nice();

  const bin = d3.bin().domain(xScale.domain()).value(xAccessor).threshold(10);

  const newData = bin(data);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(newData, yAccessor)])
    .range([dimensions.ctrHeight, 0])
    .nice();

  // Draw Bars
  ctr
    .selectAll("rect")
    .data(newData)
    .join("rect")
    .attr("width", (d) =>
      d3.max([0, xScale(d.x1) - xScale(d.x0) - dimensions.padding])
    )
    .attr("height", (d) => dimensions.ctrHeight - yScale(yAccessor(d)))
    .attr("x", (d) => xScale(d.x0))
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("fill", "#01c5c4");

  // Add Labels
  ctr
    .append("g")
    .classed("bar-labels", true)
    .selectAll("text")
    .data(newData)
    .join("text")
    .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(yAccessor(d)) - 10)
    .text(yAccessor);

  // Draw Axis
  const xAxis = d3.axisBottom(XScale);

  const xAxisGroup = ctr
    .append("g")
    .style("transform", `translateY(${dimensions.ctrHeight}px)`);

  xAxisGroup.call(xAxis);
}

draw();
