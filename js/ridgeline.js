const drawRidgeline = (data) => {

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
      .domain([0, 240000])
      .thresholds(12)
      .value(d => d.salary)(roleData);
  });
  console.log("roles", roles);


  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 30, bottom: 25, left: 120};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#ridgeline")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  const minSalary = 0;
  const maxSalary = 240000;
  let maxHeight = 0;
  roles.forEach(role => {
    const roleMaxHeight = d3.max(role.bins, d => d.length);
    maxHeight = roleMaxHeight > maxHeight ? roleMaxHeight : maxHeight;
  });

  // X scale
  // Why not a band scale?
  const xScale = d3.scaleLinear()
    .domain([minSalary, maxSalary])
    .range([0, innerWidth]);

  // Roles vertical position scale
  const rolesScale = d3.scaleBand()
    .domain(roles.map(role => role.id))
    .range([0, innerHeight]);

  // Areas vertical scale
  const supperpositionFactor = 5;
  const roleVerticalScale = d3.scaleLinear()
    .domain([0, maxHeight])
    .range([0, supperpositionFactor * rolesScale.bandwidth()])
    .nice();


  /**************************/
  /*      Add the axes      */
  /**************************/
  const bottomAxis = d3.axisBottom(xScale)
    .tickSize(innerHeight * -1)
    .tickSizeOuter(0);
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const rolesAxis = d3.axisLeft(rolesScale)
    .tickSize(innerWidth * -1)
    .tickSizeOuter(0);
  innerChart
    .append("g")
      .call(rolesAxis);

    
  /*******************************/
  /*    Append the shapes    */
  /*******************************/
  roles.forEach(role => {

    // Append the rectangles
    // const rectWidth = xScale(role.bins[0].x1) - xScale(role.bins[0].x0);
    // innerChart
    //   .append("g")
    //     .attr("class", `ridgeline-rectangles-${role.id}`)
    //   .selectAll(`rect-${role.id}`)
    //   .data(role.bins)
    //   .join("rect")
    //     .attr("class", `rect-${role.id}`)
    //     .attr("x", d => xScale(d.x0))
    //     .attr("y", d => rolesScale(role.id) - roleVerticalScale(d.length) + rolesScale.bandwidth()/2)
    //     .attr("width", rectWidth)
    //     .attr("height", d => roleVerticalScale(d.length));

    // Append the areas
    const areaGenerator = d3.area()
      .x(d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
      .y0(rolesScale(role.id) + rolesScale.bandwidth()/2)
      .y1(d => rolesScale(role.id) - roleVerticalScale(d.length) + rolesScale.bandwidth()/2)
      .curve(d3.curveCatmullRom);
    innerChart
      .append("path")
        .attr("class", `area-${role.id}`)
        .attr("d", areaGenerator(role.bins))
        .attr("fill", "darkolivegreen")
        .attr("fill-opacity", 0.4);
  });


}