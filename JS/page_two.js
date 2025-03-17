const drawPieChart = async () => {
  let width = 700;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const mediaQuery = window.matchMedia("(max-width:600px)");

  if (mediaQuery.matches) {
    width = 400;
  }

  const first_dose = await d3.csv("data/first_dose_by_age.csv");
  const second_dose = await d3.csv("data/second_dose_by_age.csv");
  const third_dose = await d3.csv("data/third_dose_by_age.csv");
  const kinds_of_vaccines = await d3.csv("data/kinds_of_vaccines.csv");

  const pie_data = kinds_of_vaccines.reduce(
    (acc = {}, curr = {}) => {
      acc["Pfizer/BioNTech"] += +curr["Pfizer/BioNTech"];
      acc["Moderna"] += +curr["Moderna"];
      acc["Oxford/AstraZeneca"] += +curr["Oxford/AstraZeneca"];
      acc["Johnson&Johnson"] += +curr["Johnson&Johnson"];
      acc["Sputnik V"] += +curr["Sputnik V"];
      acc["Sinovac"] += +curr["Sinovac"];
      acc["Sinopharm/Beijing"] += +curr["Sinopharm/Beijing"];
      acc["CanSino"] += +curr["CanSino"];
      acc["Novavax"] += +curr["Novavax"];
      acc["Covaxin"] += +curr["Covaxin"];
      acc["Pfizer/BioNTech MIL"] += +curr["Pfizer/BioNTech MIL"];
      acc["Moderna MIL"] += +curr["Moderna MIL"];
      acc["Oxford/AstraZeneca MIL"] += +curr["Oxford/AstraZeneca MIL"];
      acc["Johnson&Johnson MIL"] += +curr["Johnson&Johnson MIL"];
      acc["Sputnik V MIL"] += +curr["Sputnik V MIL"];
      acc["Sinovac MIL"] += +curr["Sinovac MIL"];
      acc["Sinopharm/Beijing MIL"] += +curr["Sinopharm/Beijing MIL"];
      acc["CanSino MIL"] += +curr["CanSino MIL"];
      acc["Novavax MIL"] += +curr["Novavax MIL"];
      acc["Covaxin MIL"] += +curr["Covaxin MIL"];

      return acc;
    },
    {
      "Pfizer/BioNTech": 0,
      Moderna: 0,
      "Oxford/AstraZeneca": 0,
      "Johnson&Johnson": 0,
      "Sputnik V": 0,
      Sinovac: 0,
      "Sinopharm/Beijing": 0,
      CanSino: 0,
      Novavax: 0,
      Covaxin: 0,
      "Pfizer/BioNTech MIL": 0,
      "Moderna MIL": 0,
      "Oxford/AstraZeneca MIL": 0,
      "Johnson&Johnson MIL": 0,
      "Sputnik V MIL": 0,
      "Sinovac MIL": 0,
      "Sinopharm/Beijing MIL": 0,
      "CanSino MIL": 0,
      "Novavax MIL": 0,
      "Covaxin MIL": 0,
    }
  );
  const svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height * 0.7)
    .style("border", "1px solid #ccc");

  const radius = Math.min(width, height) / 4;
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const pie = d3
    .pie()
    .value((d) => d[1])
    .sort(null);

  const color = d3.scaleOrdinal().range(d3.schemeCategory10);

  svg
    .append("g")
    .attr("transform", "translate(" + width / 3.5 + "," + height / 3 + ")")
    .selectAll(".arc")
    .data(pie(Object.entries(pie_data)))
    .join("path")
    .attr("fill", (d) => color(d.data[0]))
    .attr("d", arc)
    .style("cursor", "pointer")
    .on("mousemove", function (e, d) {
      let tooltip = d3
        .select(".tooltip")
        .transition()
        .duration(100)
        .style("opacity", 1)
        .style("display", "block");

      d3.select(".tooltip")
        .html(
          `<div class="tooltip-header">${d.data[0]}</div>
      <div class="tooltip-body">${d.data[1]}</div>`
        )
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(".tooltip").style("display", "none");
    });

  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left + margin.right}, ${margin.top + 10})`
    );

  legend
    .selectAll("rect")
    .data(Object.keys(pie_data))
    .join("rect")
    .attr("fill", (d) => color(d))
    .attr("width", 10)
    .attr("height", 10)
    .attr("y", (d, i) => i * 15);

  legend
    .selectAll("text")
    .data(Object.keys(pie_data))
    .join("text")
    .attr("fill", (d) => color(d))
    .attr("y", (d, i) => i * 15 + 5)
    .attr("x", 15)
    .attr("dy", "0.35em")
    .attr("font-size", "12px")
    .text((d) => d);

  // title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Kinds of Vaccines");
};

drawPieChart();
