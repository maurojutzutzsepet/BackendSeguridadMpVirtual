/* eslint-disable no-undef */
var cfg = require("../../../cf");

exports.oauthEndpoint = {
  url: () => `http://localhost:${cfg.port}`
};
