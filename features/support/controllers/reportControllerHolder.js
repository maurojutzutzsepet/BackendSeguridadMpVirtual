var reporter = require("cucumber-html-reporter");
var fs = require("fs");
//PARA ENTORNO EN SERVIDORES CI
const basePath = "/home/httpd-reports/backend";
//PARA ENTORNO LOCAL
// const basePath = "./features/reports/html/backend";
const reportControllerHolder = {
  /**
   * capture
   * @t => capture the controllator from cucumber-js environment
   * description
   *    - Capture a resolver from cucumber-js environment and asign the test controller
   * return:
   *    - a promise that asign a resolver
   */
  generateReportsHTML: function(
    version,
    node_env,
    browser,
    scenarios,
    executed,
    reportProject,
    reportBranch,
    reportNumber
  ) {
    const folderPath = `${basePath}/${reportProject}/${reportBranch}/${reportProject}-${reportBranch}-build-id-${reportNumber}/funcional`;
    const filePath = `${folderPath}/index.html`;
    console.log(`File: ${filePath}`);
    var options = {
      theme: "bootstrap",
      jsonFile: "features/reports/report.json",
      output: filePath,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: true,
      metadata: {
        "App Version": version,
        "Test Environment": node_env,
        Browser: browser,
        Parallel: scenarios,
        Executed: executed
      }
    };
    //create if not exist folder
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
    //create branch-build folder
    if (!fs.existsSync(`${basePath}/${reportProject}`))
      fs.mkdirSync(`${basePath}/${reportProject}`);
    if (!fs.existsSync(`${basePath}/${reportProject}/${reportBranch}`))
      fs.mkdirSync(`${basePath}/${reportProject}/${reportBranch}`);
    if (
      !fs.existsSync(
        `${basePath}/${reportProject}/${reportBranch}/${reportProject}-${reportBranch}-build-id-${reportNumber}`
      )
    )
      fs.mkdirSync(
        `${basePath}/${reportProject}/${reportBranch}/${reportProject}-${reportBranch}-build-id-${reportNumber}`
      );
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    //generate html report  
    reporter.generate(options);
    console.log(`Report generated`);
  }
};
module.exports = reportControllerHolder;
