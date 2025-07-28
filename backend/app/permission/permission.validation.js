const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");
const { resourceTypes, actionTypes, scope } = require("../../config/enums");

const getPermissionById = {
  params: Joi.object().keys({
    permissionId: Joi.string().custom(objectId).required(),
  }),
};

const getAllPermissions = {
  query: Joi.object().keys({
    resource: Joi.string(),
    action: Joi.string(),
    scope: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createPermission = {
  body: Joi.object().keys({
    resource: Joi.string().valid(...Object.values(resourceTypes)).required(),
    action: Joi.string().valid(...Object.values(actionTypes)).required(),
    scope: Joi.string().valid(...Object.values(scope)).required(),
    description: Joi.string(),
    role:Joi.array()
  }),
};

const updatePermission = {
  params: Joi.object().keys({
    permissionId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    resource: Joi.string().valid(...Object.values(resourceTypes)),
    action: Joi.string().valid(...Object.values(actionTypes)),
    scope: Joi.string().valid(...Object.values(scope)),
    description: Joi.string(),
  }).min(1),
};
const deletePermission = {
  params: Joi.object().keys({
    permissionId: Joi.string().custom(objectId).required(),
  }),
}
module.exports = {
  getPermissionById,
  getAllPermissions,
  createPermission,
  updatePermission,
};