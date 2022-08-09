const getMedianSalary = (salary) => {
  switch (salary) {
    case "$0 - $19,999":
      return 10000;
    case "$20,000 - $39,999":
      return 30000;
    case "$40,000 - $59,999":
      return 50000;
    case "$60,000 - $79,999":
      return 70000;
    case "$80,000 - $99,999":
      return 90000;
    case "$100,000 - $119,999":
      return 110000;
    case "$120,000 - $139,999":
      return 130000;
    case "$140,000 - $159,999":
      return 150000;
    case "$160,000 - $179,999":
      return 170000;
    case "$180,000 - $199,999":
      return 190000;
    case "$200,000 - $219,999":
      return 210000;
    case "$220,000 - $239,999":
      return 230000;
    case "$240,000 or more":
      return 250000;
  };
}

// Load data
d3.csv("./data/earnings_per_role.csv", d => {
  if (d.pay_annual_USD !== "$240,000 or more") {
    return {
      role: d.role,
      gender: d.gender,
      salary: getMedianSalary(d.pay_annual_USD)
    };
  }
}).then(data => {
  console.log("data", data);
  // console.log("designers", data.filter(d => d.role === "Designer").length)
  // console.log("Scientist", data.filter(d => d.role === "Scientist").length)
  // console.log("Developer", data.filter(d => d.role === "Developer").length)
  // console.log("Engineer", data.filter(d => d.role === "Engineer").length)
  // console.log("Journalist", data.filter(d => d.role === "Journalist").length)
  // console.log("Analyst", data.filter(d => d.role === "Analyst").length)
  // console.log("Cartographer", data.filter(d => d.role === "Cartographer").length)
  // console.log("Leadership", data.filter(d => d.role === "Leadership").length)
  // console.log("Teacher", data.filter(d => d.role === "Teacher").length)

  drawHistogram(data);
  drawBoxplot(data);
  drawPyramid(data);
  drawSmallMultiples(data);
});