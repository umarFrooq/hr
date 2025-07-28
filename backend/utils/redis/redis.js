'use strict'

const Redis = require('ioredis')
const config = require('../../config/config')

const redis = new Redis(config.redis.options)
// const redis = new Redis()
module.exports = redis
