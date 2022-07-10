async function draw() {
  // Data
  const data = await d3.csv("data.csv");

  // Dimensions
  let dimensions = {
    width: 600,
    height: 600,
    margins: 10,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2;
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2;

  const radius = dimensions.ctrWidth / 2;

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
  const popPie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);
  const slices = popPie(data);

  const colors = d3.quantize(d3.interpolateSpectral, data.length);

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(colors);

  // Arc Generator
  const arc = d3.arc().outerRadius(radius).innerRadius(0);

  const arcLabels = d3.arc().outerRadius(radius).innerRadius(200);

  // Draw Shapes
  const arcsGroup = ctr
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight / 2})`
    );

  const labelsGroup = ctr
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight / 2})`
    )
    .classed("labels", true);

  arcsGroup
    .selectAll("path")
    .data(slices)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.name));

  labelsGroup
    .selectAll("text")
    .data(slices)
    .join("text")
    .attr("transform", (d) => `translate(${arcLabels.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", -4)
        .attr("font-weight", "bold")
        .text((d) => d.data.name)
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", 9)
        .text((d) => d.data.value)
    );
}

draw();
