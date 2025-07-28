/**
 * @class ApiError
 * @extends {Error}
   * Creates an instance of ApiError.
   * @param {number} statusCode
   * @param {string} message
   * @param {boolean} [isOperational=true]
   * @param {string} [stack='']
   * @memberof ApiError
*/
class ApiError extends Error {
  constructor(statusCode, message, userMessage, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.userMessage = userMessage ? userMessage : message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
