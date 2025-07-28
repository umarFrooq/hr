const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");
const { roleTypes, countries } = require("../../config/enums");
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const emergencyContactJoi = Joi.object({
  name: Joi.string().trim().required(),
  relationship: Joi.string().trim().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  email: Joi.string().trim().lowercase().email().required(),
});

// Address Schema
const addressJoi = Joi.object({
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string()
    .valid(...Object.values(countries))
    .default(countries.PAK),
  zipCode: Joi.string().trim().optional(),
});

// Main User Schema
const createUser = {
  body: Joi.object({
    employeeId: Joi.string().trim().required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().lowercase().email().required(),
    phone: myCustomJoi.string().phoneNumber().required(),
    dateOfBirth: Joi.date().optional(),
    bio: Joi.string().trim().optional(),
    department: Joi.string().trim().required(),
    jobTitle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
      .message('Password must be alphanumeric and at least 8 characters long')
      .optional(),
    role: Joi.string()
      .valid(...Object.values(roleTypes)),

    isActive: Joi.boolean(),
    organization: Joi.string().custom(objectId).optional(),
    reportsTo: Joi.string().custom(objectId).optional(),
    address: addressJoi.optional(),
    emergencyContact: emergencyContactJoi.optional(),
    admin: Joi.string().custom(objectId),
    client: Joi.string().custom(objectId)
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).optional()
  }),
  body: Joi.object({
    employeeId: Joi.string().trim(),
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().trim(),
    phone: myCustomJoi.string(),
    dateOfBirth: Joi.date(),
    bio: Joi.string().trim(),
    department: Joi.string(),
    jobTitle: Joi.string(),
    startDate: Joi.date(),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
      .message('Password must be alphanumeric and at least 8 characters long')
      .optional(),
    role: Joi.string()
      .valid(...Object.values(roleTypes)),

    isActive: Joi.boolean(),
    organization: Joi.string().custom(objectId).optional(),
    admin: Joi.string().custom(objectId),
    reportsTo: Joi.string().custom(objectId).optional(),
    address: addressJoi.optional(),
    emergencyContact: emergencyContactJoi.optional(),
    salary:Joi.number(),
    advanceSalary:Joi.number()

  })
};
// 'role', "employeeId", "email", "phone", "department", "role", "organization", "admin", "reportsTo", "to", "from", "client"
const getUsers = {
  query: Joi.object().keys({
    role: Joi.string().valid(...Object.values(roleTypes)),
    employeeId: Joi.string().trim(),
    email: Joi.string().trim().email(),
    phone: myCustomJoi.string().phoneNumber(),
    department: Joi.string().trim(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    organization: Joi.string().custom(objectId),
    admin: Joi.string().custom(objectId),
    reportsTo: Joi.string().custom(objectId),
    to: Joi.date(),
    from: Joi.date(),
    name: Joi.string(),
    value: Joi.string(),
  }),
};

const uploadDocuments = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    removeFiles: Joi.array(),
    customNames: Joi.array()
  }),
}
module.exports = {
  createUser,
  updateUser,
  getUsers,
  uploadDocuments
};