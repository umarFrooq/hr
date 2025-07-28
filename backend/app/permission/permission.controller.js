const catchAsync = require("../../utils/catchAsync");
const permissionService = require("./permission.service");
const pick = require("../../utils/pick");

const getAllPermissions = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const filter = pick(req.query, ["resource", "action","scope","name"]);
  const result = await permissionService.getAllPermissions(filter, options);
  res.sendStatus(result);
});
const createPermission = catchAsync(async (req, res) => {
  const result = await permissionService.createPermission(req.body);
  res.sendStatus(result);
});

const updatePermissionById = catchAsync(async (req, res) => {
  const result = await permissionService.updatePermissionById(req.params.permissionId, req.body);
  res.sendStatus(result);
});
const getPermissionById = catchAsync(async (req, res) => {
  const result = await permissionService.getPermissionById(req.params.permissionId);
  if (!result) {
    throw new ApiError(status.NOT_FOUND, 'PERMISSION_NOT_FOUND');
  }
  res.sendStatus(result);
});
const deletePermissionById = catchAsync(async (req, res) => {
  const result = await permissionService.deletePermissionById(req.params.permissionId);
  res.sendStatus(result);
});
module.exports = {
  getAllPermissions,
  createPermission,
  updatePermissionById,
  getPermissionById,
  deletePermissionById
};