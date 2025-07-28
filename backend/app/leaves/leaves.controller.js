const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const leaveService = require("./leaves.service");

const createLeaveRequest = catchAsync(async (req, res) => {
  const result = await leaveService.createLeaveRequest(req.body, req.user, req.permission);
  res.sendStatus(result);
});

const updateLeaveRequest = catchAsync(async (req, res) => {
  const result = await leaveService.leaveRequestHandler(req.params.leaveId, req.body, req.user, req.permission);
  res.sendStatus(result);
});

const getAllLeaveRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["user", "admin", "client", "organization", "reportTo", "leaveType", "status", "approver"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await leaveService.getAllLeave(filter, options, req.user, req.permission);
  res.sendStatus(result);
});

const getLeaveById = catchAsync(async (req, res) => {
  const result = await leaveService.getLeaveById(req.params.leaveId);
  res.sendStatus(result);
});
const deleteLeaveRequest = catchAsync(async (req, res) => {
  const result = await leaveService.deleteLeaveRequest(req.params.leaveId, req.user, req.permission);
  res.sendStatus(result);
});

module.exports = {
  createLeaveRequest,
  updateLeaveRequest,
  getAllLeaveRequests,
  getLeaveById,
  deleteLeaveRequest
};
