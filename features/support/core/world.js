/* eslint-disable no-undef */ 
const { setWorldConstructor } = require("cucumber");
const dotenv = require("dotenv");

const testControllerHolder = require("../controllers/testControllerHolder");
let args = {};

function setArgs(parameters) {
  dotenv.config();
  args["version"] = parameters["version"]
    ? parameters["version"]
    : process.env["VERSION"];
  args["node_env"] = parameters["node_env"] ? parameters["node_env"] : process.env["NODE_ENV"];
  args["browser"] = parameters["browser"]
    ? parameters["browser"]
    : process.env["BROWSER"];
  args["scenarios"] = parameters["scenarios"]
    ? parameters["scenarios"]
    : process.env["SCENARIOS"];
  args["executed"] = parameters["executed"]
    ? parameters["executed"]
    : process.env["EXECUTED"];
  args["report-number"] = parameters["report-number"]
    ? parameters["report-number"]
    : process.env["REPORT_NUMBER"];
  args["report-project"] = parameters["report-project"]
    ? parameters["report-project"]
    : process.env["REPORT_PROJECT"];
    args["report-branch"] = parameters["report-branch"]
    ? parameters["report-branch"]
    : process.env["REPORT_BRANCH"];
}
//set cucumber and testcafe environments
setWorldConstructor(function({ attach, parameters }) {
  //set arguments
  setArgs(parameters);

  this.waitForTestController = testControllerHolder
    .get()
    .then(tc => (testController = tc));

  this.attach = attach;

  //set chrome for default if not exist a browser
  this.setBrowser = function() {
    if (parameters.browser === undefined) return "chrome";
    return parameters.browser;
  };
});

module.exports = args;
