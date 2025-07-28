const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");

const getRoleById = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId).required(),
  }),
};

const getAllRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    permissions: Joi.array().items(Joi.string().custom(objectId)),
  }),
};
const updateRoleById = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    permissions: Joi.array().items(Joi.string().custom(objectId)),
  }),
};
module.exports = {
  createRole,
  updateRoleById,
  getRoleById,
  getAllRoles,
};



