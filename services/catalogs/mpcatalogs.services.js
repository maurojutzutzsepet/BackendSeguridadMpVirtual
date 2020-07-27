/************************************************************************
 * IMPORTS
 ************************************************************************/
const axios = require("axios");
const {
  getCacheJSON,
  setCacheJSON
} = require("../../utils/redis/redis.util");
const {
  getService
} = require("../axios/axios.services")
/************************************************************************
 * SERVICES
 ************************************************************************/
exports.connMPCatalogsService = async urlReq => {
  const items = await getService(urlReq);
  if (!items || items.data.length !== 1) return null;
  return items.data[0];
};

exports.saveMPCatalogsService = (client, key, value, duration) =>
  setCacheJSON(client, key, value, duration);

exports.getMPCatalogsService = async (client, key) =>
  await getCacheJSON(client, key);