/**
 * Impelementation of cache utils using redis service
 */

/**
 * @fileoverview Cache utils
 * @requires NPM:redis
 * @requires NPM:config
 */


const redis = require("../redis/redis");
const { redisEnums } = require("../../config/enums");
let config = require("../../config/config");

/**
 * Create key for cache element
 * @param {String} key --Key for cache element
 * @param {String} id --id for cache element to make it unique
 * @returns {Promise<VideoModel>}
 */

let getKey = (key, id) => {
  let _key = "";
  if(key) _key += `${config.env}/${key}`;
  if(id) _key += `-${id}`;
  return _key;
}

/**
 * Get cache element from redis
 * @param {String} key --Key for cache element
 * @param {String} id --id for cache element to make it unique
 * @returns {Promise<VideoModel>}
 */

const getCache = async (key,id=undefined) => {
    let _key = getKey(key,id);
    let result = await redis.get(_key);
    let cacheResult =result && result.length  ? JSON.parse(result) : false;
    return cacheResult;
}

/**
 * set cache element from redis
 * @param {String} key --Key for cache element
 * @param {String} id --id for cache element to make it unique
 * @param {JSON} data --data to be cached
 * @param {Number} ttl --time to live for cache element
 * @returns {Promise<VideoModel>}
 */
const setCache = async (key,id=undefined, data, ttl = redisEnums.TTL.HOUR) => {
  if (key) {
    let _key = getKey(key,id);  
    redis.set(_key, JSON.stringify(data), "EX", ttl);
    return data;
  } else {
    return false;
  }
};



module.exports = { setCache, getCache };
