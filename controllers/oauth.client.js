/************************************************************************
 * IMPORTS
 ************************************************************************/
const cfg = require("../cf");
const {
  getOptionGetOauthService,
  getUserSystemService,

  createTokenJSONService,

  connOauthVerifyService,
  connOauthTokenService
} = require("../services/oauth/oauth.services");
/************************************************************************
 * MESSAGES
 ************************************************************************/
const {
  errorMessages
} = require("../messages/es");
/************************************************************************
 * VARIABLES
 ************************************************************************/
const urlAuthToken = cfg.urlOauth + cfg.oauthRequest;
/************************************************************************
 * CONTROLLERS
 ************************************************************************/
/**
 * verify
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's verify if the access token is valid
 */
exports.verify = async function (req, res, next) {
  //check system
  if (req.headers.system === undefined || req.headers.system === "")
    return res.status(400).send({
      valid: false,
      status: errorMessages["NO_SYSTEM"]
    });
  //check access token
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization === ""
  )
    return res.status(400).send({
      valid: false,
      status: errorMessages["NO_AUTHORIZATION_HEADER"]
    });
  //set oautg url with custom system
  const urlReq = cfg.urlOauth + req.headers.system;
  //request if the refresh token is correct with the oauth verify
  const response = await connOauthVerifyService(urlReq, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
  //if exist error, then return error 400
  if (!response)
    return res.status(400).send({
      valid: false,
      msg: errorMessages["NO_VALID_SYSTEM"]
    });
  //if is not valid, then return error 401
  if (!response.data.valid)
    return res
      .status(401)
      .send({
        valid: false,
        status: errorMessages["NO_AUTHORIZATION"]
      });
  next();
};
/**
 * loginOauth
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * @body =>
 *          username:
 *          password:
 * description
 *    - it's verify if the credentials are corrects and return an access token
 */
exports.loginOauth = async function (req, res, next) {
  //check username
  if (req.body.username === undefined || req.body.username === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_CUI"]
      });
  //check user password
  if (req.body.password === undefined || req.body.password === "")
    return res
      .status(400)
      .send({
        valid: false,
        status: errorMessages["NO_PASSWORD"]
      });
  //set data send
  const dataSend = {
    grant_type: "password",
    username: req.body.username,
    password: req.body.password
  };
  //oauth options
  const optionsAuth = getOptionGetOauthService({
    "Content-Type": "application/x-www-form-urlencoded",
    system: cfg.systemSSO //'SFZv'
  });
  //request oauth token
  const response = await connOauthTokenService(
    urlAuthToken,
    dataSend,
    optionsAuth
  );
  //if exist error, then return error 203
  if (!response)
    return res
      .status(203)
      .send({
        valid: false,
        status: errorMessages["INVALID_STRUCT"]
      });
  //if is not valid, then return error 203
  if (!response.data.valid) return res.status(203).send({
    valid: false,
    status: errorMessages["NO_AUTHORIZATION"]
  });
  //set token data
  const token = response.data.token;
  //get user system
  const userSystem = getUserSystemService(
    token.user.info.systems,
    cfg.systemSSO
  );
  //if system don't exists, return a error
  if (!userSystem)
    return res.status(400).send({
      valid: false,
      status: errorMessages["UNSIGNED_USER_SYSTEM"]
    });
  //set accessToken
  const accessToken = createTokenJSONService(token, userSystem);
  res
    .status(200)
    .send({
      valid: true,
      token: accessToken
    });
};

/**
 * refreshTokenOauth
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * @params =>
 *          refreshToken:
 *          password:
 * description
 *    - it's verify if the refresh token is valid and return the new access token
 */
exports.refreshTokenOauth = async function (req, res, next) {
  //check refresh token
  if (req.params.refreshToken === undefined || req.params.refreshToken === "")
    return res.status(400).send({
      valid: false,
      status: errorMessages["NO_REFRESH_TOKEN_PARAMETER"]
    });
  //request access token
  const dataSend = {
    grant_type: "refresh_token",
    refresh_token: req.params.refreshToken
  };
  //oauth options
  const optionsAuth = getOptionGetOauthService({
    "Content-Type": "application/x-www-form-urlencoded"
  });
  //request oauth token
  const response = await connOauthTokenService(
    urlAuthToken,
    dataSend,
    optionsAuth
  );
  //if exist error, then return error 203
  if (!response)
    return res
      .status(203)
      .send({
        valid: false,
        status: errorMessages["INVALID_STRUCT"]
      });
  //if is not valid, then return error 203
  if (!response.data.valid) return res.status(203).send({
    valid: false,
    status: errorMessages["NO_VALID_REFRESH_TOKEN"]
  });
  //set token
  const token = response.data.token;
  //set user system
  const userSystem = getUserSystemService(
    token.user.info.systems,
    cfg.systemSSO
  );
  //if system don't exists, return a error
  if (!userSystem)
    return res.status(400).send({
      valid: false,
      status: errorMessages["UNSIGNED_USER_SYSTEM"]
    });
  //set access token
  const accessToken = createTokenJSONService(token, userSystem);
  res
    .status(200)
    .send({
      valid: true,
      token: accessToken
    });
};