async function draw() {
  // Data
  const data = await d3.csv("educative-apple-stock-price-data-line-chart.csv");

  const parseDate = d3.timeParse("%Y-%m-%d");
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

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Draw Container
  const ctr = svg
    .append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    );

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

  ctr.append("g").call(yAxis);

  const xAxis = d3.axisBottom(xScale);

  ctr
    .append("g")
    .call(xAxis)
    .style("transform", `tranlateY(${dimensions.ctrHeight}px)`);
}

draw();
