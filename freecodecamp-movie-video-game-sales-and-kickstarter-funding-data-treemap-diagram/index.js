const videoGameSales = "video-game-sales-data.json",
  movieSales = "movie-sales-data.json",
  kickstarterFunding = "kickstarter-funding-data.json";

async function draw($data) {
  // Data
  const data = await d3.json($data);

  // Formatters
  const timeFormatter = d3.timeFormat("%M:%S"),
    parseTime = d3.timeParse("%M:%S");

  // Accessor Functions
  const xAccessor = (d) => d.Year,
    yAccessor = (d) => d.Seconds,
    timeAccessor = (d) => d.Time,
    nameAccessor = (d) => d.Name,
    nationalityAccessor = (d) => d.Nationality,
    dopingAccessor = (d) => d.Doping,
    parsedTimeAccessor = (d) => parseTime(d.Time);

  // Dimensions
  let dimensions = {
    width: 1100,
    height: 750,
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
    .attr("data-yvalue", (d) => parsedTimeAccessor(d))
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
}

draw(videoGameSales);

d3.select("#video-game-sales").on("click", () => draw(videoGameSales));
d3.select("#movie-sales").on("click", () => draw(movieSales));
d3.select("#kickstarter-funding").on("click", () => draw(kickstarterFunding));
