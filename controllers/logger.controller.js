const cfg = require("../cf.js");
const expressWinston = require("express-winston");
const winston = require("winston");

require("winston-mongodb");
const urlConnMongoBitacora = `mongodb://${cfg.mongoBUsername}:${cfg.mongoBPassword}@${cfg.mongoBHost}:${cfg.mongoBPort}/${cfg.mongoBDatabase}?authSource=admin`;
console.log(urlConnMongoBitacora);
const requestLog = expressWinston.logger({
  transports: [
    /*
    new winston.transports.Console({
      format: winston.format.json({
        space: 2
      })
    }),
    */
    new winston.transports.MongoDB({
      db: urlConnMongoBitacora,
      options: {
        useNewUrlParser: true,
        poolSize: 2,
        autoReconnect: true
      },
      level: "info",
      storeHost: true,
      name: "2019-174_actGeneralesBitacora",
      collection: "logs"
    })
  ],
  meta: true,
  //msg: "Request: HTTP {{req.method}} {{req.url}}; Username: {{req.user.preferred_username}}; ipAddress {{req.connection.remoteAddress}}",
  msg: "Request: HTTP {{req.method}} {{req.url}}",
  requestWhitelist: [
    "url",
    "method",
    "httpVersion",
    "originalUrl",
    "query",
    "body",
    "clientIp"
  ],
  responseWhitelist: ["body"],
  bodyBlacklist: ["password"]
});

exports.requestLog = requestLog;
