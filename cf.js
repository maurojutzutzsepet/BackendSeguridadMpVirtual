const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  // ------------- CONSTANTES PROPIAS --------------
  allowMethods: "GET,PUT,POST,DELETE",
  allowHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-filename, Content-disposition, system, action, cui, rol, env",
  allowExpose: "x-filename, Content-disposition",
  // ------------- CONSTANTES INYECTABLES --------------
  //Global variables
  host: process.env.HOST,
  port: process.env.PORT,
  messageTerminal: process.env.MESSAGE_TERMINAL,
  nodeEnvironment: process.env.NODE_ENV,

  //SQLServer database
  sqlServerName: process.env.SQLSERVER_NAME,
  sqlServerUsername: process.env.SQLSERVER_USERNAME,
  sqlServerPassword: process.env.SQLSERVER_PASSWORD,
  sqlServerPort: process.env.SQLSERVER_PORT,
  sqlServerHost: process.env.SQLSERVER_HOST,
  sqlServerDialect: process.env.SQLSERVER_DIALECT,
  sqlServerLogging: !!parseInt(process.env.SQLSERVER_LOGGING),
  //Cucumber testing

  //Redis Cache Database
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisTimeSSO: process.env.REDIS_TIME_SSO,
  redisTimeCatalogs: process.env.REDIS_TIME_CATALOGS,

  //OAUTH
  allowOrigin: process.env.ALLOW_ORIGIN,
  userOauth: process.env.USER_OAUTH,
  passOauth: process.env.PASS_OAUTH,
  oauthRequest: process.env.OAUTH_REQUEST,
  urlOauth: process.env.URL_OAUTH,

  //SSO
  systemSSO: process.env.SYSTEM_SSO,
  urlSSOHost: process.env.URL_SSO_HOST,
  urlSSOPort: process.env.URL_SSO_PORT,

  //Mongo database for business logic
  mongoLHost: process.env.MONGO_L_HOST,
  mongoLPort: process.env.MONGO_L_PORT,
  mongoLDatabase: process.env.MONGO_L_DATABASE,
  mongoLUsername: process.env.MONGO_L_USERNAME,
  mongoLPassword: process.env.MONGO_L_PASSWORD,

  //Mongo database for business bitacora
  mongoBHost: process.env.MONGO_B_HOST,
  mongoBPort: process.env.MONGO_B_PORT,
  mongoBDatabase: process.env.MONGO_B_DATABASE,
  mongoBUsername: process.env.MONGO_B_USERNAME,
  mongoBPassword: process.env.MONGO_B_PASSWORD,

  //Swagger documentation OpenApi 2.0
  basePath: process.env.BASE_PATH,
  swaggerPort: process.env.SWAGGER_PORT ? process.env.SWAGGER_PORT : process.env.PORT,

  //Strapi database for business logic
  strapiCHost: process.env.STRAPI_C_HOST,
  strapiCPort: process.env.STRAPI_C_PORT,
  strapiCProtocol: process.env.STRAPI_C_PROTOCOL,
  strapiCDatabase: process.env.STRAPI_C_DATABASE
};