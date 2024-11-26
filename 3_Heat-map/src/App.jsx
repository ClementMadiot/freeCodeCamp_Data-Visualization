import React from "react";
import * as d3 from "d3";

// dimensions
const width = 940;
const height = 430;
const marginTop = 20;
const marginBottom = 30;
const marginRight = 20;
const marginLeft = 60;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].reverse();

const App = () => {
  const datafetch = () => {
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
      .then((res) => res.json())
      .then((data) => {
        displayMap(data);
      });
  };

  const displayMap = (data) => {
    console.log(data);
    // Remove existing SVG if it exists
    d3.select("body").select("svg").remove();

    const svg = d3.select("body").append("svg");

    const xSclale = d3
      .scaleLinear()
      .domain(d3.extent(data.monthlyVariance, (d) => d.year))
      .range([marginLeft, width - marginRight]);

    const yScale = d3
      .scaleBand()
      .domain(monthNames)
      .range([height - marginBottom, marginTop]);

    const axis = (svg) => {
      svg.select("#x-axis").remove();
      svg.select("#y-axis").remove();

      // Add x-axis
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(xSclale).tickFormat(d3.format("d")));

      // Add y-axis
      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(yScale));
    };
    axis(svg);

    const rect = (svg, data) => {
      svg
        .append("g")
        .attr("id", "map")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xSclale(d.year))
        .attr("y", (d) => yScale(monthNames[d.month - 1]))
        .attr("width", 8)
        .attr("height", 30)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance)
        .attr("fill", (d) => (d.variance > 0 ? "red" : "blue"));
    };
    rect(svg, data.monthlyVariance);

    const legend = (svg) => {
      // Remove existing legend if it exists
      svg.select("#legend").remove();

      const xValues = [
        { value: 2.8, color: "#4575B4" },
        { value: 3.9, color: "#74ADD1" },
        { value: 5.0, color: "#ABD9E9" },
        { value: 6.1, color: "#E0F3F8" },
        { value: 7.2, color: "#FFFFBF" },
        { value: 8.3, color: "#FEE090" },
        { value: 9.5, color: "#FDAE61" },
        { value: 10.6, color: "#F46D43" },
        { value: 11.7, color: "#D73027" },
        { value: 12.8, color: "#D73027" },
      ];

      const legendGroup = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(100, 460)`);

      xValues.forEach((x, i) => {
        legendGroup
          .append("rect")
          .attr("x", x.value * 40) // Adjust the multiplier as needed for spacing
          .attr("y", 10)
          .attr("width", 36)
          .attr("height", 36)
          .attr("fill", x.color);
      });

      xValues.forEach((x) => {
        legendGroup
          .append("g")
          .attr("class", "tick")
          .attr("transform", `translate(${x.value * 40 + 15}, 50)`)
          .append("text")
          .text(x.value.toFixed(1))
          .attr("dy", "0.71em")
          .attr("y", 6)
          .attr("x", 0)
          .style("text-anchor", "middle");
      });
    };

    legend(svg);
  };

  datafetch();
  return (
    <>
      <h1 id="title" className="text-center text-2xl mt-6 mb-4 font-semibold">
        Monthly Global Land-Surface Temperature
      </h1>
      <p id="description" className="text-center text-xl font-semibold">
        1753 - 2015: base temperature 8.66℃
      </p>
    </>
  );
};

export default App;
