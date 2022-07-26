const videoGameSales = "video-game-sales-data.json",
  movieSales = "movie-sales-data.json",
  kickstarterFunding = "kickstarter-funding-data.json",
  videoGameSalesElement = document.getElementById("video-game-sales"),
  movieSalesElement = document.getElementById("movie-sales"),
  kickstarterFundingElement = document.getElementById("kickstarter-funding");

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

  // temporary text
  ctr
    .append("text")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${dimensions.width * 0.45}, ${dimensions.height * 0.25})`
    )
    .style("font-size", "1.5rem")
    .text($data);

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
}

draw(videoGameSales);

videoGameSalesElement.addEventListener(
  "click",
  () => {
    // ...
    draw(videoGameSales);
  },
  false
);
movieSalesElement.addEventListener(
  "click",
  () => {
    // ...
    draw(movieSales);
  },
  false
);
kickstarterFundingElement.addEventListener(
  "click",
  () => {
    // ...
    draw(kickstarterFunding);
  },
  false
);
