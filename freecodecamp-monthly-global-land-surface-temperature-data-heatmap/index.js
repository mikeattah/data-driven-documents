async function draw() {
  // Data
  const data = await d3.json("data.json");

  // Dimensions
  let dimensions = {
    width: 2000,
    height: 750,
    margins: 75,
  };

  const row = 12,
    col = Math.ceil(data.length / row),
    box = Math.ceil((dimensions.width - dimensions.margins * 2) / col);

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

  function heatmap(scale) {
    // Scales
    let colorScale;

    if (scale === "linear") {
      colorScale = d3
        .scaleLinear()
        .domain(d3.extent(data))
        .range(["white", "red"]);
    } else if (scale === "quantize") {
      colorScale = d3
        .scaleQuantize()
        .domain(d3.extent(data))
        .range(["white", "pink", "red"]);
    } else if (scale === "quantile") {
      colorScale = d3
        .scaleQuantile()
        .domain(data)
        .range(["white", "pink", "red"]);
    } else if (scale === "threshold") {
      colorScale = d3
        .scaleThreshold()
        .domain([45200, 135600])
        .range(d3.schemeReds[3]);
    }

    // Draw Squares
    svg
      .append("g")
      .attr("transform", "translate(2,2)")
      .attr("stroke", "black")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", box - 3)
      .attr("height", box - 3)
      .attr("x", (d, i) => box * (i % 20))
      .attr("y", (d, i) => box * ((i / 20) | 0))
      .attr("fill", colorScale);
  }

  d3.select("#metric").on("change", function (e) {
    e.preventDefault();

    heatmap(this.value);
  });

  heatmap("linear");
}

draw();
