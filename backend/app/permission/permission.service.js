const { Permission } = require("../../utils/mongoose/mongoose");
const { roleBulkWrite, findRoles } = require("../roles/role.service");
const mongoose = require("mongoose");

const createPermission = async (body) => {

  body["name"] = `${body.resource}:${body.action}:${body.scope}`;

  const result = await Permission.create(body);
  if (body.role) {
    const updatePermissions = [];
    const role = await findRoles({ name: { $in: body.role } });
    if (role && role.length) {
      role.forEach((role) => {
        const permission =
          role?.permissions?.map(
            (permission) => new mongoose.Types.ObjectId(permission.id)
          ) || [];
        permission.push(new mongoose.Types.ObjectId(result.id));
        updatePermissions.push({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(role.id) },
            update: { $set: { permissions: permission } }
          }
        })
      });
      if (updatePermissions && updatePermissions.length) {
        await roleBulkWrite(updatePermissions);
      }
    }

  }
  return result;
};

const updatePermission = async (id, body) => {
  const permission = await Permission.findByIdAndUpdate(id, body, { new: true });
  return permission;
};

const deletePermission = async (id) => {
  const permission = await Permission.findByIdAndDelete(id);
  return permission;
};
const getPermissionById = async (id) => {
  const permission = await Permission.findById(id);
  return permission;
};

const getAllPermissions = async (filter, options) => {
  const permissions = await Permission.paginate(filter, options);
  console.log(permissions.results.map(permission => permission.id))
  return permissions;
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
  getAllPermissions
}