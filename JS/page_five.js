
const drawChart = async () => {
  const width = 350;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  
  const first_dose = await d3.csv(
    "data/share-people-ONEDOSE-vaccinated-covid.csv"
    
  );
  const second_dose = await d3.csv(
    "data/share-people-fully-vaccinated-covid.csv"
  );

  /*const third_dose_data = await d3.csv(
    
  );*/
  //"data/covid-vaccine-booster-doses-per-capita.csv"
 
  //let selcted_dose = first_dose_data;
   
  

  
  const dateParse = d3.timeParse("%d-%m-%Y");

  //const countries = (first_dose_data((d) => d.Entity));
  //console.log(countries);

 
    let selected_country = "Italy";
    let selected_age = "60-69";

    let first_dose_data = first_dose.filter(
    (d) => d.Entity === selected_country
  );
  let second_dose_data = second_dose.filter(
    (d) => d.Entity === selected_country
  );

  let first_data = first_dose.filter(
    (d) => d.Entity === selected_age
  );
  let second_data = second_dose.filter(
    (d) => d.Entity === selected_age
  );

  
  
  /*let third_dose_data = third_dose.filter(
    (d) => d.Entity === selectedCountry
  );
 */
  /*var nested = d3.nest()
  .key(d => d.Entity)
  .entries(first_dose_data)
  console.log(nested)*/


  const first_dose_svg = d3
    .select("#dose-one")
    .append("svg")
    .attr("width", width + margin.left  + margin.right)
    .attr("height", height  + margin.top + margin.bottom + 20)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const second_dose_svg = d3
    .select("#dose-two")
    .append("svg")
    .attr("width", width + margin.left  + margin.right)
    .attr("height", height + margin.top  + margin.bottom + 20)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  /*const third_dose_svg = d3
    .select("#dose-three")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);*/

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

  /*const thirdDoseX = d3
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
    .nice();*/
    

  const firstDoseXAxis = d3.axisBottom(firstDoseX).ticks(5);
  const firstDoseYAxis = d3.axisLeft(firstDoseY);
  const secondDoseXAxis = d3.axisBottom(secondDoseX).ticks(5);
  const secondDoseYAxis = d3.axisLeft(secondDoseY);
  /*const thirdDoseXAxis = d3.axisBottom(thirdDoseX).ticks(5);
  const thirdDoseYAxis = d3.axisLeft(thirdDoseY);*/

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

  /*third_dose_svg
    .append("g")
    .attr("class", "third-dose-x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(thirdDoseXAxis);

  third_dose_svg
    .append("g")
    .attr("class", "third-dose-y-axis")
    .call(thirdDoseYAxis);*/

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
    .text("Initial Dose Vaccination Share");

 

  first_dose_svg
    .append("path")
    .datum(first_dose_data)
    .attr("class", "line-chart")
    .attr("fill", "none")
    .attr("stroke", "black")
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
    .text("Booster Dose Vaccination Share" );

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
  /*third_dose_svg
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
    .text("third Dose Vaccination Share in");

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
      d3.line()
        .x((d) => thirdDoseX(dateParse(d.Day)))
        .y((d) => thirdDoseY(+d["people_vaccinated_per_hundred"]))
    );
*/
      
    /*third_dose_data = third_dose_data.filter(
  (d) => d.Entity === selected_country
    );
    first_dose_data = first_dose_data.filter(
      (d) => d.Entity === selected_country
    );
    second_dose_data = second_dose_data.filter(
      (d) => d.Entity === selected_country
    );
    /*third_dose_data = third_dose_data.filter(
      (d) => d.Entity === selectedCountry
    );*/
   

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

  /*third_dose_svg
    .selectAll(".third-dose-x-axis")
    .transition()
    .call(thirdDoseXAxis);
  third_dose_svg
    .selectAll(".third-dose-y-axis")
    .transition()
    .call(thirdDoseYAxis);*/

  first_dose_svg
    .select(".first-title")
    .text("Initial Dose Vaccination Share in" + " " + selected_country);

  second_dose_svg
    .select(".second-title")
    .text("Booster Dose Vaccination Share in" + " " + selected_country);

 /* third_dose_svg
    .select(".third-title")
    .text("Third Dose Vaccination Share in" + " " + selected_country);*/

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

  /*third_dose_svg
    .datum(third_dose_data)
    .select(".line-chart")
    .transition()
    .attr(
      "d",
      d3
        .line()
        .x((d) => thirdDoseX(dateParse(d.Day)))
        .y((d) => thirdDoseY(+d["people_vaccinated_per_hundred"]))
    );*/

  
  d3.select("#country-select").on("change", function () {
    selected_country = d3.select(this).property("value");
    
    

    /*third_dose_data = third_dose.filter(
      (d) => d.Entity === selectedCountry
    );*/
     first_dose_data = first_dose.filter(
      (d) => d.Entity === selected_country
    );
    second_dose_data = second_dose.filter(
      (d) => d.Entity === selected_country
    );
    d3.select("#age-select").on("change", function () {
      selected_age = d3.select(this).property("value");
  
      first_data = first_dose.filter(
        (d) => d.Entity === selected_country
      );
      second_data = second_dose.filter(
        (d) => d.Entity === selected_country
      );
    
    firstDoseX.domain(d3.extent(first_data, (d) => dateParse(d.Day)));

    firstDoseY
      .domain([0, d3.max(first_data, (d) => +d["people_vaccinated_per_hundred"])]);

    secondDoseX.domain(d3.extent(second_data, (d) => dateParse(d.Day)));

    secondDoseY
      .domain([0, d3.max(second_data, (d) => +d["people_vaccinated_per_hundred"])]);
      
    

      
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


      first_dose_svg
      .select(".first-title")
      .text("Initial Dose Share in" + " " + selected_country);

    second_dose_svg
      .select(".second-title")
      .text("Booster Dose Share in" + " " + selected_country);
      
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


      first_dose_svg
      .select(".first-title")
      .text("Initial Dose Share in  " + "  " +  selected_country + " of " + selected_age);

    second_dose_svg
      .select(".second-title")
      .text("Booster Dose Share in  " + "  " +  selected_country + " of " + selected_age);
      
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
  
    });
  })  

};

drawChart();