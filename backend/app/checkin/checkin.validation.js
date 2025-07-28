const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");
const { workStatus } = require("../../config/enums");

const getCheckin = {
  params: Joi.object().keys({
    checkinId: Joi.string().custom(objectId).required(),
  }),
};

const createCheckin = {
  body: Joi.object().keys({
    user: Joi.string().custom(objectId).required(),
    checkin: Joi.date().default(new Date()),
    checkOut: Joi.date(),
    employeeId: Joi.string(),
  }),
};

const updateCheckin = {
  params: Joi.object().keys({
    checkinId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    user: Joi.string().custom(objectId).required(),
    checkin: Joi.string(),
    checkOut: Joi.string(),
    employeeId: Joi.string(),
  }),
};
// "name", "user", "email", "reportsTo", "workStatus", "organizationId", "clientId", "to", "from","admin"
const getAllCheckIn = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    email: Joi.string().email(),
    reportsTo: Joi.string().custom(objectId),
    workStatus: Joi.string().valid(...Object.values(workStatus)),
    organizationId: Joi.string().custom(objectId),
    clientId: Joi.string().custom(objectId),
    to: Joi.date(),
    from: Joi.date(),
    admin: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
module.exports = {
  getCheckin,
  createCheckin,
  updateCheckin,
  getAllCheckIn
};