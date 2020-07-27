const redis = require("redis");
const cfg = require("../../cf");
module.exports.catalogs = {
  db: "catalogs",
  cache: redis.createClient({
    db: 0,
    port: cfg.redisPort,
    host: cfg.redisHost
  })
};
module.exports.sso = {
  db: "sso",
  cache: redis.createClient({
    db: 1,
    port: cfg.redisPort,
    host: cfg.redisHost
  })
};
module.exports.morpheus = {
  db: "morpheus",
  cache: redis.createClient({
    db: 2,
    port: cfg.redisPort,
    host: cfg.redisHost
  })
};
