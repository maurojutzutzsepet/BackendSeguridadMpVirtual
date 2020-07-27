/************************************************************************
 * IMPORTS
 ************************************************************************/
const {
  getService,
  postService,
  putService
} = require("../axios/axios.services")
const cfg = require("../../cf");
/************************************************************************
 * SERVICES
 ************************************************************************/
exports.getHeadersBodyService = headers => {
  const requestHeaders = {
    Authorization: headers.authorization,
    cui: headers.cui,
    rol: headers.rol,
    action: headers.action,
    system: headers.system,
    env: cfg.nodeEnvironment
  };
  return requestHeaders;
};

exports.comparePasswordsService = (password, confirmPassword) =>
  password === confirmPassword ? true : false;

exports.connSSOService = (urlReq, dataSend) => getService(urlReq, dataSend);

exports.connSsoSendTemporalPasswordService = (urlReq, dataSend) => postService(urlReq, dataSend, {});
exports.connSsoChangeUserPasswordAfterReset = (urlReq, dataSend) => postService(urlReq, dataSend, {});

exports.connSsoChangeUserPasswordService = (urlReq, dataSend) => putService(urlReq, dataSend);