/************************************************************************
 * IMPORTS
 ************************************************************************/
const cfg = require("../cf.js");
const {
  getHeadersBodyService,

  connSSOService,
  connSsoSendTemporalPasswordService,
  connSsoChangeUserPasswordAfterReset,
  connSsoChangeUserPasswordService,

  comparePasswordsService
} = require("../services/valisSSO/validSSO.services");
/************************************************************************
 * MESSAGES
 ************************************************************************/
const {
  errorMessages
} = require("../messages/es");
/************************************************************************
 * VARIABLES
 ************************************************************************/
const
  urlSsoValidate = `${cfg.urlSSOHost}:${cfg.urlSSOPort}/validate/request/`,
  urlSsoSendTemporalPassword = `${cfg.urlSSOHost}:${cfg.urlSSOPort}/credentials/restore/pass/cuimail`,
  urlSsoChangeTemporalPassword = `${cfg.urlSSOHost}:${cfg.urlSSOPort}/credentials/change/pass/oblig`,
  urlSsoChangePassword = `${cfg.urlSSOHost}:${cfg.urlSSOPort}/credentials/change/pass`;
/************************************************************************
 * CONTROLLERS
 ************************************************************************/
/**
 * verifyCheck
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * @params =>
 *          cui:
 *          rol:
 *          action:
 *          env:
 * description
 *    - it's verify if the sso action is valid
 */
exports.verifyCheck = async function (req, res, next) {
  //validate if exists all paremeters that are required
  if (req.headers.cui === undefined || req.headers.cui === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_CUI"]
      });

  if (req.headers.rol === undefined || req.headers.rol === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_ROL"]
      });

  if (req.headers.action === undefined || req.headers.action === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_ACTION"]
      });

  if (req.headers.env === undefined || req.headers.env === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_ENV"]
      });
  //set data send
  const dataSend = {
    headers: getHeadersBodyService(req.headers)
  };
  //request to sso service
  const response = await connSSOService(urlSsoValidate, dataSend);
  //the response isn't valid
  if (!response)
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_VALID_REQUEST"]
    });
  //if is not valid, then return error 203
  if (!response.data.valid)
    return res.status(401).send({
      valid: false,
      status: errorMessages["NO_AUTHORIZATION_SSO"]
    });
  res
    .status(200)
    .send(response.data);
};

/**
 * sendTemporalPassword
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's send a temporal pass to mail
 */
exports.sendTemporalPassword = async function (req, res, next) {
  //check user
  if (req.body.dpiuser === undefined || req.body.dpiuser === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_VALID_DATA"]
    });
  //set data send
  const dataSend = {
    dpiuser: req.body.dpiuser
  };
  //request if the refresh token is correct with the oauth verify
  const response = await connSsoSendTemporalPasswordService(urlSsoSendTemporalPassword, dataSend);
  //the response isn't valid
  if (!response)
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_VALID_REQUEST"]
    });
  //if is not valid, then return error 203
  if (!response.data.valid)
    return res.status(401).send({
      valid: false,
      status: response.data.msg
    });
  //set response data
  const responseData = {
    useremail: response.data.useremail
  };
  res
    .status(200)
    .send({
      valid: true,
      data: responseData,
      msg: response.data.msg
    });
};
/**
 * changeUserPasswordAfterReset
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's change the password after the user restart his password
 */
exports.changeUserPasswordAfterReset = async function (req, res, next) {
  //check user
  if (req.params.cui === undefined || req.params.cui === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_CUI"]
    });
  //check new password
  if (req.body.newPassword === undefined || req.body.newPassword === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_NEW_PASSWORD"]
    });
  // check confirmation of password
  if (req.body.confirmPass === undefined || req.body.confirmPass === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_CONFIRM_PASSWORD"]
    });
  //compare if both passwords are the same
  if (!comparePasswordsService(req.body.newPassword, req.body.confirmPass))
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_SAME_PASSWORDS"]
    });
  //set data send
  const dataSend = {
    newPassword: req.body.newPassword,
    confirmPass: req.body.confirmPass,
    cui: req.params.cui
  };
  //request if the refresh token is correct with the oauth verify
  const response = await connSsoChangeUserPasswordAfterReset(
    urlSsoChangeTemporalPassword, dataSend);
  //if exist error, then return error 400
  if (!response)
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_VALID_REQUEST"]
    });
  //if is not valid, then return error 203
  if (!response.data.valid)
    return res.status(401).send({
      valid: false,
      msg: response.data.msg
    });
  res
    .status(200)
    .send({
      valid: true,
      data: response.data.data,
      msg: response.data.msg
    })
};

/**
 * changeUserPassword
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's change the password
 */
exports.changeUserPassword = async function (req, res, next) {
  //check user
  if (req.params.cui === undefined || req.params.cui === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_CUI"]
    });
  //check new password
  if (req.body.newPassword === undefined || req.body.newPassword === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_NEW_PASSWORD"]
    });
  //check confirmation of password
  if (req.body.password === undefined || req.body.password === "")
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_PASSWORD"]
    });
  if (comparePasswordsService(req.body.newPassword, req.body.password))
    return res.status(401).send({
      valid: false,
      msg: errorMessages["SAME_PASSWORDS"]
    });
  //set data send
  const dataSend = {
    newPassword: req.body.newPassword,
    password: req.body.password,
    cui: req.params.cui
  };
  //request if the refresh token is correct with the oauth verify
  const response = await connSsoChangeUserPasswordService(urlSsoChangePassword, dataSend);
  //if exist error, then return error 400
  if (!response)
    return res.status(401).send({
      valid: false,
      msg: errorMessages["NO_VALID_REQUEST"]
    });
  //if is not valid, then return error 203
  if (!response.data.valid)
    return res.status(401).send({
      valid: false,
      status: response.data.msg
    });
  res
    .status(200)
    .send({
      valid: true,
      data: response.data.data,
      msg: response.data.msg
    })
};