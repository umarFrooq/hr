// Service is responsible for the business logic and query implementation

const ApiError = require("../../utils/ApiError");
const { Test } = require("../../utils/mongoose/mongoose");
const httpStatus = require("http-status");
const { projectModules, responseMessages } = require("../../utils/response.message");

/**
 * Create a Test
 * @param {Object} body
 * @returns {Promise<Test>}
 */

const createTest = async (body) => {
  try {
    return await Test.create(body);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${projectModules.TEST} ${responseMessages.CREATION_FAILED}`)
  }
}
/**
 * Query for getTest
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<Test>}
 * 
 */

const getAllTest = async (filter, options) => {
  try {
    return await Test.paginate(filter, options);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${responseMessages.GET_ALL_FAILED} ${projectModules.TEST}`)
  }
}

module.exports = {
  createTest,
  getAllTest
}
