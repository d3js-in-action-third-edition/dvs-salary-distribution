const drawBoxplot = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 30, bottom: 25, left: 60};
  const width = 555;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#boxplot")
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
  const genders = ["Female", "Male"];
  const xScale = d3.scaleBand()
    .domain(genders)
    .range([0, innerWidth]);

  // Y scale
  const maxSalary = d3.max(data, d => d.salary);
  const yScale = d3.scaleLinear()
    .domain([0, maxSalary])
    .range([innerHeight, 0])
    .nice();

  // Female quartiles
  const femalesSalaries = data.filter(d => d.gender === "Female").map(d => d.salary);
  const femalesQuartilesScale = d3.scaleQuantile()
    .domain(femalesSalaries)
    .range([0, 1, 2, 3]);
  const femalesMin = d3.min(femalesSalaries);
  const femalesMax = d3.max(femalesSalaries);
  const femalesQuartiles = femalesQuartilesScale.quantiles();
  console.log("boxplot boundaries females", femalesMin, femalesQuartiles, femalesMax);

  // Male quartiles
  const malesSalaries = data.filter(d => d.gender === "Male").map(d => d.salary);
  const malesQuartilesScale = d3.scaleQuantile()
    .domain(malesSalaries)
    .range([0, 1, 2, 3]);
  const malesMin = d3.min(malesSalaries);
  const malesMax = d3.max(malesSalaries);
  const malesQuartiles = malesQuartilesScale.quantiles();
  console.log("boxplot boundaries males", malesMin, malesQuartiles, malesMax);


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
  

  /******************************/
  /*      Add the boxplots      */
  /******************************/
  const boxplotWidth = 60;
  const boxplotStrokeWidth = 3;
  genders.forEach(gender => {
    const boxplotContainer = innerChart
      .append("g")
        .attr("class", `boxplot-${gender}`)
        .attr("stroke", slateGray)
        .attr("stroke-width", boxplotStrokeWidth);

    // Append rectangles
    boxplotContainer
      .append("rect")
        .attr("x", xScale(gender) + xScale.bandwidth()/2 - boxplotWidth/2)
        .attr("y", gender === "Female" ? yScale(femalesQuartiles[2]) : yScale(malesQuartiles[2]))
        .attr("width", boxplotWidth)
        .attr("height", gender === "Female" 
                          ? yScale(femalesQuartiles[0]) - yScale(femalesQuartiles[2])
                          : yScale(malesQuartiles[0]) - yScale(malesQuartiles[2]))
        .attr("fill", "transparent");

    // Append median
    boxplotContainer
      .append("line")
        .attr("x1", xScale(gender) + xScale.bandwidth()/2 - boxplotWidth/2)
        .attr("x2", xScale(gender) + xScale.bandwidth()/2 + boxplotWidth/2)
        .attr("y1", gender === "Female" ? yScale(femalesQuartiles[1]) : yScale(malesQuartiles[1]))
        .attr("y2", gender === "Female" ? yScale(femalesQuartiles[1]) : yScale(malesQuartiles[1]))
        .attr("stroke", gender === "Female" ? womenColor : menColor)
        .attr("stroke-width", 6);

    // Append whiskers
    boxplotContainer
      .append("line")
        .attr("x1", xScale(gender) + xScale.bandwidth()/2)
        .attr("x2", xScale(gender) + xScale.bandwidth()/2)
        .attr("y1", gender === "Female" ? yScale(femalesMax) : yScale(malesMax))
        .attr("y2", gender === "Female" ? yScale(femalesQuartiles[2]) : yScale(malesQuartiles[2]));
    boxplotContainer
      .append("line")
        .attr("x1", xScale(gender) + xScale.bandwidth()/2)
        .attr("x2", xScale(gender) + xScale.bandwidth()/2)
        .attr("y1", gender === "Female" ? yScale(femalesQuartiles[0]) : yScale(malesQuartiles[0]))
        .attr("y2", gender === "Female" ? yScale(femalesMin) : yScale(malesMin));

    // Append upper and lower limits
    boxplotContainer
      .append("line")
        .attr("x1", xScale(gender) + xScale.bandwidth()/2 - boxplotWidth/2)
        .attr("x2", xScale(gender) + xScale.bandwidth()/2 + boxplotWidth/2)
        .attr("y1", gender === "Female" ? yScale(femalesMax) : yScale(malesMax))
        .attr("y2", gender === "Female" ? yScale(femalesMax) : yScale(malesMax));
    boxplotContainer
      .append("line")
        .attr("x1", xScale(gender) + xScale.bandwidth()/2 - boxplotWidth/2)
        .attr("x2", xScale(gender) + xScale.bandwidth()/2 + boxplotWidth/2)
        .attr("y1", gender === "Female" ? yScale(femalesMin) : yScale(malesMin))
        .attr("y2", gender === "Female" ? yScale(femalesMin) : yScale(malesMin));

  });

};