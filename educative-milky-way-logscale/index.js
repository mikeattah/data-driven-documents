// Source: https://www.educative.io/courses/master-d3-data-visualization
async function draw() {
  // Data
  const data = await d3.json("data.json");

  // Accessor Functions
  const nameAccessor = (d) => d.name;
  const sizeAccessor = (d) => d.size;

  // Dimensions
  let dimensions = {
    width: 250,
    height: 500,
    margin: 50,
  };

  // Create SVG Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Scale
  const universeScale = d3
    .scaleLog()
    .domain(d3.extent(data, sizeAccessor))
    .range([dimensions.height - dimensions.margin, dimensions.margin]);

  // Draw Circles
  const circleGroup = svg
    .append("g")
    .style("font-size", "16px")
    .style("dominant-baseline", "middle");

  circleGroup
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", "6")
    .attr("cx", dimensions.margin)
    .attr("cy", (d) => universeScale(sizeAccessor(d)));

  // Draw Labels
  circleGroup
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", dimensions.margin + 15)
    .attr("y", (d) => universeScale(sizeAccessor(d)))
    .text(nameAccessor);

  // Draw Axis
  const axis = d3.axisLeft(universeScale);

  svg
    .append("g")
    .attr("transform", `translate(${dimensions.margin}, 0)`)
    .call(axis);
}

draw();
