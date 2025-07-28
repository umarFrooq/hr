const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");
const { leaveStatus, leavesType } = require("../../config/enums");

const getLeaveById = {
  params: Joi.object().keys({
    leaveId: Joi.string().custom(objectId).required(),
  }),
};
const getAllLeaveRequests = {
  query: Joi.object().keys({
    name: Joi.string(),
    user: Joi.string().custom(objectId),
    admin: Joi.string().custom(objectId),
    client: Joi.string().custom(objectId),
    organization: Joi.string().custom(objectId),
    reportTo: Joi.string().custom(objectId),
    approver: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    status: Joi.string().valid(...Object.values(leaveStatus)),
    leaveType: Joi.string().valid(...Object.values(leavesType)),

    to: Joi.date(),
    from: Joi.date(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const leaveRequestHandler = {
  params: Joi.object().keys({
    leaveId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid(...Object.values(leaveStatus)).required(),
    reply: Joi.string(),

  }),
}

const createLeaveRequest = {
  body: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    leaveType: Joi.string().valid(...Object.values(leavesType)).required(),
    reason: Joi.string(),
    halfDay: Joi.boolean(),
  }),
}
module.exports = {
  getLeaveById,
  getAllLeaveRequests,
  createLeaveRequest,
  leaveRequestHandler

};