const { awsLambdaKey } = require("../config/config");
const ApiError = require("../utils/ApiError");

/**
 * Authorizes requests for AWS Lambda functions by checking if the request header contains the correct lambda key.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function in the request-response cycle.
 * @throws {ApiError} - Throws an ApiError with 401 status code and a message "Unauthorized [lambda-key]" if the lambda key is incorrect.
 */

const lambdaAuth = (req, res, next) => {
  if (req.headers["lambda-key"] != awsLambdaKey)
    throw new ApiError(401, "Unauthorized " + req.headers["lambda-key"]);
  else next();
}

module.exports = lambdaAuth;