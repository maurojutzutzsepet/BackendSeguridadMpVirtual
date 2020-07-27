/* eslint-disable no-undef */
/**
 * Initialize Variables
 */
const { writeFileSync, unlinkSync } = require("fs");
const createTestCafe = require("testcafe");
const {
  AfterAll,
  setDefaultTimeout,
  Before,
  After,
  Status
} = require("cucumber");

const args = require("./world");

const {
  addErrorToController
} = require("./errorHandling");

const { free } = require("../controllers/testControllerHolder");
const {
  generateReportsHTML
} = require("../controllers/reportControllerHolder");

const TIMEOUT = 20000;

let isTestCafeError = false;
let cafeRunner = null;
let n = 0;

//set default time out
setDefaultTimeout(TIMEOUT);
/**
 * createTestFile
 * description
 *    - creates the test file and writes the code for run the test environment
 */
function createTestFile() {
  writeFileSync(
    "test.js",
    'const errorHandling = require("./features/support/core/errorHandling.js");\n' +
      'const {capture} = require("./features/support/controllers/testControllerHolder.js");\n\n' +
      'fixture("fixture")\n' +
      "test\n" +
      '("test", capture)'
  );
}

/**
 * runTest
 * description
 *    - runs the all test from step_definitions folder and creates the screenshots for reports
 */
function runTest(iteration, browser) {
  createTestCafe("localhost", 1338 + iteration, 1339 + iteration)
    .then(function(tc) {
      cafeRunner = tc;
      const runner = tc.createRunner();
      return runner
        .src("./test.js")
        .browsers(browser)
        .run()
        .catch(function(error) {
          console.error(error);
        });
    })
    .then(function(report) {});
}

/**
 * Before
 * description
 *    - create the test environment and runs the test
 */
Before(function() {
  runTest(n, this.setBrowser());
  createTestFile();
  n += 2;
  return this.waitForTestController.then(function(testController) {
    return testController.maximizeWindow();
  });
});

/**
 * After
 * description
 *    - delete the test environment and runs the test
 */
After(function() {
  unlinkSync("test.js");
  free();
});

/**
 * After
 * description
 *    - If any test fails, generate the reports
 */
After(async function(testCase) {
  const world = this;
  if (testCase.result.status === Status.FAILED) {
    isTestCafeError = true;
    attachScreenshotToReport = world.attachScreenshotToReport;
    addErrorToController();
  }
});

/**
 * AfterAll
 * description
 *    - If any test fails, generate the reports
 */
AfterAll(function() {
  let intervalId = null;

  function waitForTestCafe() {
    intervalId = setInterval(checkLastResponse, 500);
  }

  function checkLastResponse() {
    if (
      testController.testRun.lastDriverStatusResponse ===
      "test-done-confirmation"
    ) {
      // generate the cucumber js reports
      generateReportsHTML(
        (version = args["version"]),
        (node_env = args["node_env"]),
        (browser = args["browser"]),
        (scenarios = args["scenarios"]),
        (executed = args["executed"]),
        (reportProject = args["report-project"]),
        (reportBranch = args["report-branch"]),
        (reportNumber = args["report-number"])
      );
      cafeRunner.close();
      process.exit();
      clearInterval(intervalId);
    }
  }

  waitForTestCafe();
});

const getIsTestCafeError = () => isTestCafeError;
exports.getIsTestCafeError = getIsTestCafeError;
