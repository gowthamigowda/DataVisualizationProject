
const currentCountry = localStorage.getItem("CurrentCounty");
let selectedCountry = "Portugal";

const selectTag = document.querySelector("#country-select");
document.querySelector("#country-select").style.display = 'none'

const drawChart = async () => {
  const width = 350;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const first_dose = await d3.csv(
    "data/share-people-ONEDOSE-vaccinated-covid.csv"
  );
  const second_dose = await d3.csv(
    "data/covid-vaccine-booster-doses-per-capita.csv"
  );

  const third_dose = await d3.csv(
    "data/share-people-fully-vaccinated-covid.csv"
  );

  
  const dateParse = d3.timeParse("%d-%m-%Y");

  const countries = [...new Set(first_dose.map((d) => d.Entity))];

  const countrySelect = d3
    .select("#country-select")
    .selectAll("option")
    .data(countries)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .attr("selected", (d) => (d === selectedCountry ? "selected" : null))
    .text((d) => d);

  let first_dose_data = first_dose.filter(
    (d) => d.Entity === selectedCountry
  );
  let second_dose_data = second_dose.filter(
    (d) => d.Entity === selectedCountry
  );
  let third_dose_data = third_dose.filter(
    (d) => d.Entity === selectedCountry
  );
 



  const first_dose_svg = d3
    .select("#dose-one")
    .append("svg")
    .attr("width", width + margin.left  + margin.right)
    .attr("height", height  + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const second_dose_svg = d3
    .select("#dose-two")
    .append("svg")
    .attr("width", width + margin.left  + margin.right)
    .attr("height", height + margin.top + + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const third_dose_svg = d3
    .select("#dose-three")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const firstDoseX = d3
    .scaleTime()
    .domain(d3.extent(first_dose_data, (d) => dateParse(d.Day)))
    .range([0, width]);

  const firstDoseY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(first_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
    ])
    .range([height, 0])
    .nice();

  const secondDoseX = d3
    .scaleTime()
    .domain(d3.extent(second_dose_data, (d) => dateParse(d.Day)))
    .range([0, width]);

  const secondDoseY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(
        second_dose_data,
        (d) => +d["people_vaccinated_per_hundred"]
      ),
    ])
    .range([height, 0])
    .nice();

  const thirdDoseX = d3
    .scaleTime()
    .domain(d3.extent(third_dose_data, (d) => dateParse(d.Day)))
    .range([0, width]);

  const thirdDoseY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(third_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
    ])
    .range([height, 0])
    .nice();

  const firstDoseXAxis = d3.axisBottom(firstDoseX).ticks(5);
  const firstDoseYAxis = d3.axisLeft(firstDoseY);
  const secondDoseXAxis = d3.axisBottom(secondDoseX).ticks(5);
  const secondDoseYAxis = d3.axisLeft(secondDoseY);
  const thirdDoseXAxis = d3.axisBottom(thirdDoseX).ticks(5);
  const thirdDoseYAxis = d3.axisLeft(thirdDoseY);

  first_dose_svg
    .append("g")
    .attr("class", "first-dose-x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(firstDoseXAxis);

  first_dose_svg
    .append("g")
    .attr("class", "first-dose-y-axis")
    .call(firstDoseYAxis);

  second_dose_svg
    .append("g")
    .attr("class", "second-dose-x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(secondDoseXAxis);

  second_dose_svg
    .append("g")
    .attr("class", "second-dose-y-axis")
    .call(secondDoseYAxis);

  third_dose_svg
    .append("g")
    .attr("class", "third-dose-x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(thirdDoseXAxis);

  third_dose_svg
    .append("g")
    .attr("class", "third-dose-y-axis")
    .call(thirdDoseYAxis);

  //x axis label
  first_dose_svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("text-anchor", "middle")
    .text("Date");

  //y axis label
  first_dose_svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("People Vaccinated per 100");

  // title
  first_dose_svg
    .append("text")
    .attr("class", "first-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "0.8rem")
    .text("First Dose Vaccination Share in" + " " + selectedCountry);

  first_dose_svg
    .append("path")
    .datum(first_dose_data)
    .attr("class", "line-chart")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d",d3.line()
        .x((d) => firstDoseX(dateParse(d.Day)))
        .y((d) => firstDoseY(+d["people_vaccinated_per_hundred"]))
    );

  //x axis label
  second_dose_svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("text-anchor", "middle")
    .text("Date");

  //y axis label
  second_dose_svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("People Vaccinated per 100");

  // title
  second_dose_svg
    .append("text")
    .attr("class", "second-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "0.8rem")
    .text("Second Dose Vaccination Share in" + " " + selectedCountry);

  second_dose_svg
    .append("path")
    .datum(second_dose_data)
    .attr("class", "line-chart")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => secondDoseX(dateParse(d.Day)))
        .y((d) => secondDoseY(+d["people_vaccinated_per_hundred"]))
    );
  
  //x axis label
  third_dose_svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("text-anchor", "middle")
    .text("Date");

  //y axis label
  third_dose_svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("People Vaccinated per 100");

  // title
  third_dose_svg
    .append("text")
    .attr("class", "third-title")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "0.8rem")
    .text("third Dose Vaccination Share in" + " " + selectedCountry);

  third_dose_svg
    .append("path")
    .datum(third_dose_data)
    .attr("class", "line-chart")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => thirdDoseX(dateParse(d.Day)))
        .y((d) => thirdDoseY(+d["people_vaccinated_per_hundred"]))
    );

  //for getting an element from the previous page
  selectedCountry = currentCountry;
  first_dose_data = first_dose.filter(
    (d) => d.Entity === selectedCountry
  );
  second_dose_data = second_dose.filter(
    (d) => d.Entity === selectedCountry
  );
  third_dose_data = third_dose.filter(
    (d) => d.Entity === selectedCountry
  );

  firstDoseX.domain(d3.extent(first_dose_data, (d) => dateParse(d.Day)));

  firstDoseY.domain([
    0,
    d3.max(first_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
  ]);

  secondDoseX.domain(
    d3.extent(second_dose_data, (d) => dateParse(d.Day))
  );

  secondDoseY.domain([
    0,
    d3.max(second_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
  ]);

  thirdDoseX.domain(d3.extent(third_dose_data, (d) => dateParse(d.Day)));

  thirdDoseY.domain([
    0,
    d3.max(third_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
  ]);

  first_dose_svg
    .selectAll(".first-dose-x-axis")
    .transition()
    .duration(1000)
    .call(firstDoseX);
  first_dose_svg
    .selectAll(".first-dose-y-axis")
    .transition()
    .duration(1000)
    .call(firstDoseYAxis);

  second_dose_svg
    .selectAll(".second-dose-x-axis")
    .transition()
    .duration(1000)
    .call(secondDoseXAxis);
  second_dose_svg
    .selectAll(".second-dose-y-axis")
    .transition()
    .duration(1000)
    .call(secondDoseYAxis);

  third_dose_svg
    .selectAll(".third-dose-x-axis")
    .transition()
    .duration(1000)
    .call(thirdDoseXAxis);
  third_dose_svg
    .selectAll(".third-dose-y-axis")
    .transition()
    .duration(1000)
    .call(thirdDoseYAxis);

  first_dose_svg
    .select(".first-title")
    .text("First Dose Vaccination Share in" + " " + selectedCountry);

  second_dose_svg
    .select(".second-title")
    .text("Second Dose Vaccination Share in" + " " + selectedCountry);

  third_dose_svg
    .select(".third-title")
    .text("Third Dose Vaccination Share in" + " " + selectedCountry);

  first_dose_svg
    .datum(first_dose_data)
    .select(".line-chart")
    .transition()
    .duration(1000)
    .attr(
      "d",
      d3
        .line()
        .x((d) => firstDoseX(dateParse(d.Day)))
        .y((d) => firstDoseY(+d["people_vaccinated_per_hundred"]))
    );

  second_dose_svg
    .datum(second_dose_data)
    .select(".line-chart")
    .transition()
    .duration(1000)
    .attr(
      "d",
      d3
        .line()
        .x((d) => secondDoseX(dateParse(d.Day)))
        .y((d) => secondDoseY(+d["people_vaccinated_per_hundred"]))
    );

  third_dose_svg
    .datum(third_dose_data)
    .select(".line-chart")
    .transition()
    .duration(1000)
    .attr(
      "d",
      d3
        .line()
        .x((d) => thirdDoseX(dateParse(d.Day)))
        .y((d) => thirdDoseY(+d["people_vaccinated_per_hundred"]))
    );

  //When the list component changes
  d3.select("#country-select").on("change", function () {
    selectedCountry = d3.select(this).property("value");
    first_dose_data = first_dose.filter(
      (d) => d.Entity === selectedCountry
    );
    second_dose_data = second_dose.filter(
      (d) => d.Entity === selectedCountry
    );
    third_dose_data = third_dose.filter(
      (d) => d.Entity === selectedCountry
    );

    firstDoseX.domain(
      d3.extent(first_dose_data, (d) => dateParse(d.Day))
    );

    firstDoseY.domain([
      0,
      d3.max(first_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
    ]);

    secondDoseX.domain(
      d3.extent(second_dose_data, (d) => dateParse(d.Day))
    );

    secondDoseY.domain([
      0,
      d3.max(
        second_dose_data,
        (d) => +d["people_vaccinated_per_hundred"]
      ),
    ]);

    thirdDoseX.domain(
      d3.extent(third_dose_data, (d) => dateParse(d.Day))
    );

    thirdDoseY.domain([
      0,
      d3.max(third_dose_data, (d) => +d["people_vaccinated_per_hundred"]),
    ]);

    first_dose_svg
      .selectAll(".first-dose-x-axis")
      .transition()
      .duration(1000)
      .call(firstDoseX);
    first_dose_svg
      .selectAll(".first-dose-y-axis")
      .transition()
      .duration(1000)
      .call(firstDoseYAxis);

    second_dose_svg
      .selectAll(".second-dose-x-axis")
      .transition()
      .duration(1000)
      .call(secondDoseXAxis);
    second_dose_svg
      .selectAll(".second-dose-y-axis")
      .transition()
      .duration(1000)
      .call(secondDoseYAxis);

    third_dose_svg
      .selectAll(".third-dose-x-axis")
      .transition()
      .duration(1000)
      .call(thirdDoseXAxis);
    third_dose_svg
      .selectAll(".third-dose-y-axis")
      .transition()
      .duration(1000)
      .call(thirdDoseYAxis);

    first_dose_svg
      .select(".first-title")
      .text("First Dose Vaccination Share in" + " " + selectedCountry);

    second_dose_svg
      .select(".second-title")
      .text("Second Dose Vaccination Share in" + " " + selectedCountry);

    third_dose_svg
      .select(".third-title")
      .text("Third Dose Vaccination Share in" + " " + selectedCountry);

    first_dose_svg
      .datum(first_dose_data)
      .select(".line-chart")
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => firstDoseX(dateParse(d.Day)))
          .y((d) => firstDoseY(+d["people_vaccinated_per_hundred"]))
      );

    second_dose_svg
      .datum(second_dose_data)
      .select(".line-chart")
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => secondDoseX(dateParse(d.Day)))
          .y((d) => secondDoseY(+d["people_vaccinated_per_hundred"]))
      );

    third_dose_svg
      .datum(third_dose_data)
      .select(".line-chart")
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .x((d) => thirdDoseX(dateParse(d.Day)))
          .y((d) => thirdDoseY(+d["people_vaccinated_per_hundred"]))
      );
  });
  if (currentCountry !== "") {
    console.log("Current Country", currentCountry);
    console.log(selectTag);
    selectTag.value = currentCountry;
  }
};

const drawPieChart = async () => {
  let width = 700;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const mediaQuery = window.matchMedia("(max-width:600px)");

  if (mediaQuery.matches) {
    width = 400;
  }

  //const first_dose = await d3.csv("data/first_dose_by_age.csv");
  //const second_dose = await d3.csv("data/second_dose_by_age.csv");
  //const third_dose = await d3.csv("data/third_dose_by_age.csv");
  let kinds_of_vaccines = await d3.csv(
    "data/kinds_of_vaccines.csv"
    );
  selectedCountry = currentCountry;
  console.log("country for pie",selectedCountry);
  kinds_of_vaccines = kinds_of_vaccines.filter(
    (d) => d.Entity === selectedCountry
  );

  const pie_data = kinds_of_vaccines.reduce(
    (acc = {}, curr = {}) => {
      acc["Pfizer/BioNTech"] = curr["Pfizer/BioNTech"];
      acc["Moderna"] = curr["Moderna"];
      acc["Oxford/AstraZeneca"] = curr["Oxford/AstraZeneca"];
      acc["Johnson&Johnson"] = curr["Johnson&Johnson"];
      acc["Sputnik V"] = curr["Sputnik V"];
      acc["Sinovac"] = curr["Sinovac"];
      acc["Sinopharm/Beijing"] = curr["Sinopharm/Beijing"];
      acc["CanSino"] = curr["CanSino"];
      acc["Novavax"] = curr["Novavax"];
      acc["Covaxin"] = curr["Covaxin"];
      acc["Pfizer/BioNTech MIL"] = curr["Pfizer/BioNTech MIL"];
      acc["Moderna MIL"] = curr["Moderna MIL"];
      acc["Oxford/AstraZeneca MIL"] = curr["Oxford/AstraZeneca MIL"];
      acc["Johnson&Johnson MIL"] = curr["Johnson&Johnson MIL"];
      acc["Sputnik V MIL"] = curr["Sputnik V MIL"];
      acc["Sinovac MIL"] = curr["Sinovac MIL"];
      acc["Sinopharm/Beijing MIL"] = curr["Sinopharm/Beijing MIL"];
      acc["CanSino MIL"] = curr["CanSino MIL"];
      acc["Novavax MIL"] = curr["Novavax MIL"];
      acc["Covaxin MIL"] = curr["Covaxin MIL"];
console.log(curr);
      return acc;
    },

      
    {
      "Pfizer/BioNTech": "",
      Moderna: "",
      "Oxford/AstraZeneca": "",
      "Johnson&Johnson": "",
      "Sputnik V": "",
      Sinovac: "",
      "Sinopharm/Beijing": "",
      CanSino: "",
      Novavax: "",
      Covaxin: "",
      "Pfizer/BioNTech MIL": "",
      "Moderna MIL": "",
      "Oxford/AstraZeneca MIL": "",
      "Johnson&Johnson MIL": "",
      "Sputnik V MIL": "",
      "Sinovac MIL": "",
      "Sinopharm/Beijing MIL": "",
      "CanSino MIL": "",
      "Novavax MIL": "",
      "Covaxin MIL": "",
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
    .text("Kinds of Vaccines in "+ " " + selectedCountry);
};



drawPieChart();
drawChart();