const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const testService = require("./test.module.service")
const httpStatus = require("http-status");

const createTest = catchAsync(async (req, res) => {
  const result = await testService.createTest(req.body);
  res.status(httpStatus.OK).send(result);
})

const getAllTest = catchAsync(async (req, res) => {
  // Pick method used to convert query string in key values pairs
  // second argument in pick is allowd properties

  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const filter = pick(req.query, ["test1", ",test2"])
  const result = await testService.getAllTest(filter, options);
  res.status(httpStatus.OK).send(result);
})


module.exports = {
  createTest,
  getAllTest
}