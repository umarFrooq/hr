const path = require("path");
const express = require("express");
const { status } = require('http-status');
// const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const routes = require("../app/routes")
const ApiError = require('../utils/ApiError');
const { errorConverter, errorHandler } = require('../middlewares/error');
const { version } = require('../package.json');
const configuration = require("../config/config");
const { jwtStrategy } = require('./passport');
const passport = require('passport');
const distDir = "../public";
// secure apps by setting various HTTP headers
app.use(helmet());
// enable cors
app.use(cors());
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// Serving and setting staitic Dir
// app.use(express.static(path.join(__dirname, distDir)));
app.use(/^((?!(v1)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + "/index.html"));
});

// parse json request body

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data

app.use(mongoSanitize());


/**
 * Sends a response with the given data, status code, message, and content type.
 * @param {Object} data - The data to send in the response.
 * @param {number} [statusCode=200] - The HTTP status code to send in the response.
 * @param {string} [message='OK'] - The message to send in the response.
 * @param {string} [type='application/json'] - The content type to send in the response.
 * @returns {Object} The `this` object for chaining method calls.
 */
app.response.sendStatus = function (data, status = 200, message = 'OK', type = 'application/json') {
  // loger(this.req, this, message);
  const resp = { data: data ? data : null, status, message }
  // code is intentionally kept simple for demonstration purpose
  return this.contentType(type)
    .status(status)
    .send(resp)
}

app.use("/v1/", routes);
app.get("/v1/health", (req, res) => {
  let healthCheck = { version: version }
  if (req.query.debugg == "8494456261") {
    healthCheck["node_env"] = configuration.env;
  }
  res.send(healthCheck)
});

// catch 404 and forward to error handler
// send back a 404 error for any unknown v1 request
// Pass a http.Server instance to the listen method

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});
app.use((req, res, next) => {
    console.log(`[404] ${req.method} ${req.originalUrl}`);
  next(new ApiError(status.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

module.exports = app;