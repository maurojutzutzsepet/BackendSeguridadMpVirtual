const axios = require("axios");

const httpControllerHolder = {
  get: (url, data) => httpControllerHolder.request("GET", url, data),
  post: (url, data) => httpControllerHolder.request("POST", url, data),
  delete: (url, data) => httpControllerHolder.request("DELETE", url, data),
  put: (url, data) => httpControllerHolder.request("PUT", url, data),

  // Send a request
  request: (method, url, data) =>
    axios({ method, url, data })
      .then(response => response["data"])
      .catch(error => {
        console.log(error);
        return null;
      })
};
module.exports = httpControllerHolder;
