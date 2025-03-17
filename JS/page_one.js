const drawChart = async () => {
  const width = 930;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const geojson = await d3.json("data/geojson.json");
  const booster = await d3.json("data/booster.json");

  const map = d3
    .select("#map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const circleSize = d3
    .scaleSqrt()
    .domain(d3.extent(booster, (d) => +d.total_boosters_per_hundred))
    .range([5, 20]);

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / 1.2 / Math.PI)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  map
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#ccc")
    .attr("stroke", "#9f9f9f")
    .style("cursor", "pointer")
    .on("click", (a, b) => {
      let currentCountry = b.properties.name;
      localStorage.setItem("CurrentCounty", currentCountry);
      console.log(currentCountry);
      window.location = "./page_four.html";
    })
    .on("mousemove", function (e, d) {
      d3.select(this).transition().duration(100).attr("fill", "#afedc0");

      let country = d.properties.name;
      let data = booster.find(function (d) {
        return d.Entity == country;
      });

      if (data) {
        let tooltip = d3
          .select(".tooltip")
          .transition()
          .duration(100)
          .style("opacity", 1)
          .style("display", "block");

        d3.select(".tooltip")
          .html(
            `<div>Country: ${data.Entity}</div> <br> <div>Total Boosters Per Hundred: ${data.total_boosters_per_hundred}</div>`
          )
          .style("left", e.pageX + 20 + "px")
          .style("top", e.pageY + "px");
      }
    })
    .on("mouseout", function (e, d) {
      d3.select(this).transition().duration(100).attr("fill", "#ccc");
      d3.select(".tooltip").style("display", "none");
    });

  map
    .selectAll("circle")
    .data(geojson.features)
    .enter()
    .append("circle")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("r", function (d) {
      let country = d.properties.name;
      let data = booster.find(function (d) {
        return d.Entity == country;
      });

      if (data) {
        return circleSize(data.total_boosters_per_hundred);
      } else {
        return 0;
      }
    })
    .attr("fill", "#008080")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#9f9f9f")
    .style("cursor", "pointer")
    .style("pointer-events", "none");
};

drawChart();
