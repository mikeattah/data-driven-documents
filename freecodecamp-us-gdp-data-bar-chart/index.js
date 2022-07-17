async function draw() {
  // Data
  const data = await d3.json("data.json").then((data) => data.data);

  // Parse Date
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Format Date
  const dateFormatter = d3.timeFormat("%B %d, %Y");
  const yearFormatter = d3.timeFormat("%Y");
  const monthFormatter = d3.timeFormat("%B");

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
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => yAccessor(d))
    .attr("fill", "#1ca8f8")
    .classed("bar", true)
    .on("touchmouse mouseenter", function (e, datum) {
      d3.select(this).attr("fill", "#c4d9eb");

      const month = monthFormatter(xAccessor(datum));
      let qtr = "";
      switch (month) {
        case "January":
          qtr = "Q1";
          break;
        case "April":
          qtr = "Q2";
          break;
        case "July":
          qtr = "Q3";
          break;
        case "October":
          qtr = "Q4";
          break;
        default:
          qtr = "";
      }

      // Tooltip
      tooltip
        .attr("data-date", datum[0])
        .style("display", "block")
        .style("top", `${e.pageY - 225}px`)
        .style("left", xScale(xAccessor(datum)) + "px");

      tooltip.select(".date-year").text(yearFormatter(xAccessor(datum)));
      tooltip.select(".date-qtr").text(qtr);
      tooltip
        .select(".amount-figure")
        .text("$" + yAccessor(datum).toLocaleString());
      tooltip.select(".amount-type").text("Billion");
    })
    .on("mouseleave", function () {
      d3.select(this).attr("fill", "#1ca8f8");
      tooltip.style("display", "none");
    });

  // Draw Axes
  const xAxis = d3.axisBottom(xScale);
  const xAxisGroup = ctr
    .append("g")
    .attr("id", "x-axis")
    .classed("tick", true)
    .attr("transform", `translate(0, ${dimensions.ctrHeight})`);
  xAxisGroup
    .append("text")
    .attr(
      "transform",
      `translate(${dimensions.ctrWidth - 185}, ${dimensions.margins - 35})`
    )
    .attr("stroke", "black")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "'Lato', sans-serif")
    .style("font-weight", "lighter")
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");
  xAxisGroup.call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  const yAxisGroup = ctr.append("g").attr("id", "y-axis").classed("tick", true);
  yAxisGroup
    .append("text")
    .attr(
      "transform",
      `translate(${dimensions.margins * 1.5}, ${dimensions.margins * 2})`
    )
    .attr("stroke", "black")
    .attr("fill", "black")
    // .attr("transform", "rotate(270deg)")
    .style("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-family", "'Lato', sans-serif")
    .style("font-weight", "lighter")
    .text("Gross Domestic Product");
  yAxisGroup.call(yAxis);
}

draw();
