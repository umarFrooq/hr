const {status} = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
// const loger = require("../middlewares/loger")

//TODO: Document errorConverter
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || status.BAD_REQUEST;
    const message = error.message || status[statusCode];
    error = new ApiError(statusCode, message,null, false, err.stack);
  }
  // loger(req, res, null, error);
  next(error);
};

// eslint-disable-next-line no-unused-vars
//TODO: Document errorHandler
const errorHandler = (err, req, res, next) => {
  let { statusCode, message, userMessage } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = status.BAD_REQUEST;
    message = err.message;
    userMessage = status[status.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    userMessage,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
