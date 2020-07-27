//EJEMPLO DE COMO SE UTILIZA REDIS, SI SE DESEA UTILI
const { sso, morpheus } = require("./redis.config");
const cfg = require("../../cf");
const {
  getCache,
  getCacheJSON,
  setCache,
  setCacheJSON
} = require("./redis.util");

async function redisExample() {
  const morpheusDataJSON = { name: "morpheus", value: "morpheus project!" };
  const ssoDataJSON = { name: "sso", value: "sso project!" };
  //guardar en cache objectos en formato json con un tiempo especifico de duración, luego se eliminará el documento
  setCacheJSON(sso.cache, ssoDataJSON.name, ssoDataJSON, duration=cfg.redisTimeSSO);
  //guardar en cache objectos en formato json sin un tiempo de duración
  setCacheJSON(sso.cache, ssoDataJSON.name, ssoDataJSON);
  //guardar en cache unicamente valores en formato de cadena de texto plano
  setCache(morpheus.cache, morpheusDataJSON.name, morpheusDataJSON.value);  
  //guardar en cache utilizando las funciones propias de la biblioteca oficial de "redis"
  sso.cache.setex(morpheusDataJSON.name, cfg.redisTimeSSO, morpheusDataJSON.value);
  // obtener desde cache objectos en formato json
  let morpheusDataJSONCache = await getCacheJSON(sso.cache, ssoDataJSON.name);
  // obtener desde cache objectos en formato de texto plano
  let ssoDataJSONCache = await getCache(morpheus.cache, morpheusDataJSON.name);
  // se puede utilizar la funcion oficial "get" de redis, pero se debe utilizar Promises. (ver la definicion del metodo "getCache")
  console.log(morpheusDataJSONCache);
  console.log(ssoDataJSONCache);
}
redisExample();
