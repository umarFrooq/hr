catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const checkinService = require("./checkin.service");

const createCheckin = catchAsync(async (req, res) => {
  const result = await checkinService.createCheckin(req.body, req.user, req.permission);
  res.sendStatus(result);
});

const updateCheckIn = catchAsync(async (req, res) => {
  const result = await checkinService.updateCheckIn(req.params.checkinId, req.body, req.user, req.permission);
  res.sendStatus(result);
});

const getAllCheckIn = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const filter = pick(req.query, ["user", "email", "reportsTo", "workStatus", "organizationId", "clientId", "to", "from","admin"]);
  const result = await checkinService.getAllCheckIn(filter, options, null, req.user, req.permission);
  res.sendStatus(result);
});

const getCheckIn = catchAsync(async (req, res) => {
  const result = await checkinService.getCheckInById(req.params.checkinId);
  res.sendStatus(result);
});

const bioMetricCheckin = catchAsync(async (req, res) => {
  const result = await checkinService.bioMetricCheckin(req.body);
  res.sendStatus(result);
});
module.exports = {
  createCheckin,
  updateCheckIn,
  getAllCheckIn,
  getCheckIn,
  bioMetricCheckin
};