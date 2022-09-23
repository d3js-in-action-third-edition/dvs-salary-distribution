const drawGradientChart = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 20, bottom: 55, left: 60};
  const width = 1000;
  const height = 400;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#gradient-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner charts
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


  /*********************************/
  /*    Calculate the quartiles    */
  /*********************************/
  const roles = [
    {id: "Designer", salaries: [], quartiles: []},
    {id: "Scientist", salaries: [], quartiles: []},
    {id: "Developer", salaries: [], quartiles: []},
    {id: "Engineer", salaries: [], quartiles: []},
    {id: "Journalist", salaries: [], quartiles: []},
    {id: "Analyst", salaries: [], quartiles: []},
    {id: "Cartographer", salaries: [], quartiles: []},
    {id: "Leadership", salaries: [], quartiles: []},
    {id: "Teacher", salaries: [], quartiles: []},
    {id: "Other", salaries: [], quartiles: []},
  ];

  roles.forEach(role => {
    role.salaries = data.filter(d => d.role === role.id).map(d => d.salary);

    const quartilesScale = d3.scaleQuantile()
      .domain(role.salaries)
      .range([0, 1, 2, 3]);
    role.quartiles = quartilesScale.quantiles();
  });

  console.log("roles", roles);


  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const xScale = d3.scaleBand()
    .domain(roles.map(d => d.id))
    .range([0, innerWidth])
    .paddingInner(0.5)
    .paddingOuter(0.2);

  // Y scale
  const maxSalary = d3.max(data, d => d.salary);
  const yScale = d3.scaleLinear()
    .domain([0, maxSalary])
    .range([innerHeight, 0])
    .nice();


  /**************************/
  /*      Add the axes      */
  /**************************/
  const bottomAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0);
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .call(leftAxis);
  svg
    .append("text")
      .text("Yearly salary (USD)")
      .attr("x", 0)
      .attr("y", 20);


  /**************************/
  /*    Append the bands    */
  /**************************/
  const defs = svg
    .append("defs")
    .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", 1);
  defs 
    .append("stop")
      .attr("offset", "0%")
      .style("stop-color", slateGray)
      .style("stop-opacity", 0.2);
  defs 
    .append("stop")
      .attr("offset", "50%")
      .style("stop-color", slateGray)
      .style("stop-opacity", 0.7);
  defs 
    .append("stop")
      .attr("offset", "100%")
      .style("stop-color", slateGray)
      .style("stop-opacity", 0.2);


  const bands = innerChart
    .selectAll(".band-container")
    .data(roles)
    .join("g")
      .attr("class", "band-container");

  bands
    .append("rect")
      .attr("x", d => xScale(d.id))
      .attr("y", d => yScale(d.quartiles[2]))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(d.quartiles[0]) - yScale(d.quartiles[2]))
      .attr("fill", "url(#gradient)");

  bands
    .append("line")
      .attr("x1", d => xScale(d.id))
      .attr("y1", d => yScale(d.quartiles[1]))
      .attr("x2", d => xScale(d.id) + xScale.bandwidth())
      .attr("y2", d => yScale(d.quartiles[1]))
      .attr("stroke", "black")
      .attr("stroke-width", 5);

};