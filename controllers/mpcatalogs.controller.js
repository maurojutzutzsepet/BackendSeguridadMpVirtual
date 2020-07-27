/************************************************************************
 * IMPORTS
 ************************************************************************/
const cfg = require("../cf");
const {
  getMPCatalogsService,

  connMPCatalogsService,

  saveMPCatalogsService
} = require("../services/catalogs/mpcatalogs.services");
const {
  catalogs
} = require("../utils/redis/redis.config");
/************************************************************************
 * MESSAGES
 ************************************************************************/
const {
  errorMessages
} = require("../messages/es");
/************************************************************************
 * VARIABLES
 ************************************************************************/
const urlStrapiC = `${cfg.strapiCProtocol}://${cfg.strapiCHost}:${cfg.strapiCPort}/${cfg.strapiCDatabase}`;
/************************************************************************
 * CONTROLLERS
 ************************************************************************/
/**
 * getAll
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's get all catalogs from Cache or DB
 */
exports.getAll = async function (req, res, next) {
  // //get data from cache
  let mpcatalogs = await getMPCatalogsService(catalogs.cache, catalogs.db);
  if (mpcatalogs)
    return res.status(200).send({
      valid: true,
      data: mpcatalogs
    });
  // get data from server
  mpcatalogs = await connMPCatalogsService(urlStrapiC);
  //if exist error, then return error 400
  if (!mpcatalogs)
    return res.status(400).send({
      valid: false,
      msg: errorMessages["INVALID_CATALOGS_REQUEST"]
    });
  //save data
  saveMPCatalogsService(
    catalogs.cache,
    catalogs.db,
    mpcatalogs,
    cfg.redisTimeCatalogs
  );
  //return data
  res
    .status(200)
    .send({
      valid: true,
      data: mpcatalogs
    });
};

/**
 * getById
 * @req => Request is used to describe an request to a server.
 * @res => Represents a response from a web request
 * @next =>  it must call next() to pass control to the next middleware function
 * description
 *    - it's get one catalog from Cache or DB by Id
 */
exports.getById = async function (req, res, next) {
  //check id catalog
  if (req.params.id === undefined || req.params.id === "")
    return res.status(401).send({
      msg: errorMessages["NO_ID_CATALOG"],
      valid: false
    });
  //set variables
  let mpcatalogs, mpcatalog;
  // //get data from cache
  mpcatalog = await getMPCatalogsService(catalogs.cache, req.params.id);
  if (mpcatalog) return res.status(200).send({
    valid: true,
    data: mpcatalog
  });
  //get data from server
  mpcatalogs = await connMPCatalogsService(urlStrapiC);
  //if exist error, then return error 400
  if (!mpcatalogs)
    return res.status(400).send({
      valid: false,
      msg: errorMessages["INVALID_CATALOGS_REQUEST"]
    });
  for (var [key, value] of Object.entries(mpcatalogs)) {
    //if catalog is equal to catalog searching, return this catalog
    if (key === req.params.id) {
      mpcatalog = value;
      res.status(200).send({
        valid: true,
        data: mpcatalog
      });
    }
    //save in redis this catalog
    saveMPCatalogsService(catalogs.cache, key, value, cfg.redisTimeCatalogs);
  }
  //if catalog don't exist, show error message
  if (!mpcatalog)
    return res.status(400).send({
      valid: false,
      msg: errorMessages["NO_EXIST_CATALOG"]
    });
};