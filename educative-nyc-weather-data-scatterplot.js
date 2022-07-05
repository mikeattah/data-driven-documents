async function draw() {
  // Data
  const data = await d3.json("educative-nyc-weather-data-scatterplot.json");
  console.log(data);

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

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.ctrWidth]);

  // Draw circles
  ctr
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", yAccessor)
    .attr("r", 5)
    .attr("fill", "red");
}

draw();
