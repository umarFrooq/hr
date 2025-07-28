const { Role } = require("../../utils/mongoose/mongoose");


const createRole = async (body) => {
  const role = await Role.create(body);
  return role;
}

const findAllRoles = async (filter, options) => {
  return await Role.paginate(filter, options)
}

const findRoleById = async (id) => {
  const role = await Role.findById(id);
  return role;
}

const updateRoleById = async (id, body) => {
  const role = await Role.findByIdAndUpdate(id, body, { new: true });
  return role;
}

const deleteRoleById = async (id) => {
  const role = await Role.findByIdAndDelete(id);
  return role;
}
const findOneRole = async (filter) => {
  const role = await Role.findOne(filter);
  return role;
}

const findRoles = async (filter) => {
  return await Role.find(filter);
}

const roleBulkWrite = async (operations) => {
  const result = await Role.bulkWrite(operations);
  return result.modifiedCount;
}
module.exports = {
  createRole,
  findAllRoles,
  findRoleById,
  updateRoleById,
  deleteRoleById,
  findOneRole,
  findRoles,
  roleBulkWrite
}