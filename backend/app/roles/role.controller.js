const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const roleService = require("./role.service");

const createRole = catchAsync(async (req, res) => {
  const result = await roleService.createRole(req.body);
  res.sendStatus(result);
});

const getAllRoles = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const filter = pick(req.query, ["name"]);
  const result = await roleService.getAllRoles(filter, options);
  res.sendStatus(result);
});
const getRoleById = catchAsync(async (req, res) => {
  const result = await roleService.getRoleById(req.params.roleId);
    res.sendStatus(result);
});
const updateRoleById = catchAsync(async (req, res) => {
  const result = await roleService.updateRoleById(req.params.roleId, req.body);
  res.sendStatus(result);
});
const deleteRoleById = catchAsync(async (req, res) => {
  const result = await roleService.deleteRoleById(req.params.roleId);
  res.sendStatus(result);
});

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById
};