const testControllerHolder = {
  /**
   * Initialize Variables
   */
  testController: null,
  captureResolver: null,
  getResolver: null,

  /**
   * capture
   * @t => capture the controllator from cucumber-js environment
   * description
   *    - Capture a resolver from cucumber-js environment and asign the test controller
   * return:
   *    - a promise that asign a resolver
   */
  capture: function(t) {
    //set controller
    testControllerHolder.testController = t;
    //validate if exist a resolver
    if (testControllerHolder.getResolver) testControllerHolder.getResolver(t);
    //return a promise
    return new Promise(
      resolve => (testControllerHolder.captureResolver = resolve)
    );
  },

  /**
   * free
   * description
   *    - Free test controller and capture the resolver
   */
  free: function() {
    //restart controller
    testControllerHolder.testController = null;
    //validate if a resolver was previously captured
    if (!testControllerHolder.captureResolver) return;
    //execute a resolver
    testControllerHolder.captureResolver();
  },

  /**
   * get
   * description
   *    - get a test controller from cucumber-js environment
   */
  get: function() {
    return new Promise(resolve => {
      //validate if exist a test controller
      if (!testControllerHolder.testController)
        //set resolver
        return (testControllerHolder.getResolver = resolve);
      //return a test controller
      resolve(testControllerHolder.testController);
    });
  }
};

module.exports = testControllerHolder;
