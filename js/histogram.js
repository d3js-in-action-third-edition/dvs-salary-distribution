const drawHistogram = (data) => {
  
  /***************************/
  /*    Generate the bins    */
  /***************************/
  const bins = d3.bin()
    .domain([0, 240000])
    .value(d => d.salary)(data);
  console.log("bins", bins);


  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 30, bottom: 50, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const minSalary = bins[0].x0;
  const maxSalary = bins[bins.length - 1].x1;
  // Why no a band scale?
  const xScale = d3.scaleLinear()
    .domain([minSalary, maxSalary])
    .range([0, innerWidth]);

  // Y scale
  const maxHeight = d3.max(bins, d => d.length);
  const yScale = d3.scaleLinear()
    .domain([0, maxHeight])
    .range([innerHeight, 0])
    .nice();

  
  /*******************************/
  /*    Append the rectangles    */
  /*******************************/
  const rectWidth = xScale(bins[0].x1) - xScale(bins[0].x0);
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", rectWidth)
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", slateGray)
      .attr("stroke", white)
      .attr("stroke-width", 2);


  /**************************/
  /*      Add the axes      */
  /**************************/
  const bottomAxis = d3.axisBottom(xScale)
    // .tickValues(d3.range(1975, 2020, 5))
    // .tickSizeOuter(0);
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);
  svg
    .append("text")
      .text("Yearly salary (USD)")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 5);

  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .call(leftAxis);
  svg
    .append("text")
      .text("Frequency")
      .attr("x", 5)
      .attr("y", 20);

};