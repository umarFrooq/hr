
const winston = require('winston');
var { SumoLogic } = require('winston-sumologic-transport');
const { logsCollector } = require("../config/config")

var options = {
  url: logsCollector
};

winston.add(new SumoLogic(options));

const loger = (req, res, message, error) => {
  try {
    let logObj = {};
    if (req.method != 'GET') {
      if (error) {
        logObj = {
          ...error,
          level: "error"
        }
      } else logObj = {
        reqMethod: req.method,
        endPoint: req.originalUrl,
        body: req.body || req.query,
        params: req.params && req.params,
        ip: req.connection.remoteAddress,
        userId: req.user && req.user.id || "",
        userName: req.user && req.user.fullname || "",
        resStatus: res.statusCode.toString(),
        time: new Date().toUTCString(),
        message: message,
        level: "info",
        service: "main"
      }

      winston.log(logObj);
    }
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = loger;