/************************************************************************
 * IMPORTS
 ************************************************************************/
const {
  getService,
  postService
} = require("../axios/axios.services")

const cfg = require("../../cf");
/************************************************************************
 * SERVICES
 ************************************************************************/
exports.getOptionGetOauthService = headers => {
  const options = {
    headers,
    auth: {
      username: cfg.userOauth,
      password: cfg.passOauth
    }
  };
  return options;
};

exports.getUserSystemService = (systems, userSystem) => {
  const system = systems.filter(system => system.tag === userSystem);
  if (system.length !== 1) return null;
  return system[0];
};

exports.createTokenJSONService = (token, userSystem) => {
  const auxToken = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    client: token.client,
    user: {
      id: token.user.id,
      info: {
        activate: token.user.info.activate,
        cui: token.user.info.cui,
        nip: token.user.info.nip,
        extern: token.user.info.extern,
        system: userSystem,
        name: token.user.info.name,
        dependency: token.user.info.dependency,
        job: token.user.info.job,
        env: token.user.info.env,
        flagTempPass: token.user.info.flagTempPass
      }
    }
  };
  return auxToken;
};

exports.connOauthVerifyService = (urlReq, dataSend) => getService(urlReq, dataSend);

exports.connOauthTokenService = (urlAuthToken, dataSend, optionsAuth) => postService(urlAuthToken, dataSend, optionsAuth);