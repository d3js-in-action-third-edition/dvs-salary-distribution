const drawSmallMultiples = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 25, right: 20, bottom: 55, left: 30};
  const width = 1000;
  const height = 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#small-multiples")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner charts
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


  /*********************************/
  /*   Create bins for each role   */
  /*********************************/
  const roles = [
    {id: "Designer", bins: []},
    {id: "Scientist", bins: []},
    {id: "Developer", bins: []},
    {id: "Engineer", bins: []},
    {id: "Journalist", bins: []},
    {id: "Analyst", bins: []},
    {id: "Cartographer", bins: []},
    {id: "Leadership", bins: []},
    {id: "Teacher", bins: []},
    {id: "Other", bins: []},
  ];
  roles.forEach(role => {
    const roleData = data.filter(d => d.role === role.id);
    role.bins = d3.bin()
      // .domain([0, 240000]) => check if domain is necessary
      .thresholds(12)
      .value(d => d.salary)(roleData);
    role["numPeople"] = roleData.length;
  });
  console.log("roles", roles);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  const numCol = 5;
  const numRows = roles.length / numCol;
  const padding = 10;
  const widthAreaChart = innerWidth / numCol - 2 * padding;
  const heightAreaChart = innerHeight / numRows - 2 * padding;

  const maxSalary = 240000; // Find in advance and store in shared constants
  const maxFrequency = d3.max(roles.map(role => d3.max(role.bins, d => d.length)));

  const xScale = d3.scaleLinear()
    .domain([0, maxSalary])
    .range([0, widthAreaChart]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([heightAreaChart, 0]);

  
  /********************************/
  /*    Append the area charts    */
  /********************************/
  roles.forEach((role, i) => {

    // Append a group and translate it
    const chart = innerChart
      .append("g")
        .attr("class", "area-chart-container")
        .attr("transform", () => {
          const index = i < numCol ? i : (i - numCol);
          const tx = index * widthAreaChart + (2 * index + 1) * padding;
          const ty = i < numCol ? 0 : heightAreaChart + 2 * padding;
          return `translate(${tx}, ${ty})`;
        });

    // Append a rectangle
    chart
      .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", widthAreaChart)
        .attr("height", heightAreaChart)
        .attr("fill", "transparent")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.5);

    // Append a histogram
    const roleData = data.filter(response => response.role === role.id);
    chart
      .append("g")
        .attr("class", "role-histogram-container")
      .selectAll(`.bar-${role.id}`)
      .data(role.bins)
      .join("rect")
        .attr("class", `bar-${role.id}`)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length / roleData.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => heightAreaChart - yScale(d.length / roleData.length))
        .attr("fill", slateGray)
        .attr("fill-opacity", 0.4);

    // Append the lines
    // from https://observablehq.com/@d3/kernel-density-estimation
    function kde(kernel, thresholds, data) {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    function epanechnikov(bandwidth) {
      return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }
    const bandwidth = 1;
    const roundingNumber = 10000;
    const threshold = d3.range(10000, 240000, roundingNumber);

    const lineGenerator = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveCatmullRom);
    
    chart
      .append("path")
      .datum(d => {
        const salaries = roleData.map(response => Math.round(response.salary / roundingNumber) * roundingNumber);
        const density = kde(epanechnikov(bandwidth), threshold, salaries);
        console.log(density)
        return density;
      })
        .attr("d", d => lineGenerator(d))
        .attr("fill", "transparent")
        .attr("stroke", slateGray)
        .attr("stroke-width", 2);

    // Append role label
    chart
      .append("text")
        .text(role.id)
        .attr("dominant-baseline", "hanging")
        .attr("x", 5)
        .attr("y", 8)
        .attr("fill", slateGray);

    // Append x axis to bottom charts
    if (i >= 5) {
      const bottomAxis = d3.axisBottom(xScale);
      chart
        .append("g")
          .attr("class", "axis-bottom")
          .attr("transform", `translate(0, ${heightAreaChart})`)
          .call(bottomAxis);

      chart
        .selectAll(".axis-bottom text")
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", -10)
          .attr("y", -7)
          .style("font-size", "11px");
    }

    // Append left axis to left charts
    if (i % numCol === 0) {
      const leftAxis = d3.axisLeft(yScale);
      chart
        .append("g")
          .attr("class", "axis-left")
          .call(leftAxis);

      chart
        .selectAll(".axis-left text")
          .style("font-size", "11px");
    }

  });

  // Append axis labels
  svg
    .append("text")
      .text("Frequency")
      .attr("dominant-baseline", "hanging")
      .attr("x", padding)
      .style("font-size", "14px");

  svg
    .append("text")
      .text("Yearly salary (USD)")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 5)
      .style("font-size", "14px");

};