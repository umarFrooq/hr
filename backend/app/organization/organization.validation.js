const Joi = require("joi");
const { objectId } = require("../../config/custom.validation");
const { countries } = require("../../config/enums");

const leaveJoi = Joi.object({
  casual: Joi.number().min(0),
  sick: Joi.number().min(0),
  annual: Joi.number().min(0),
  maternity: Joi.number().min(0),
  paternity: Joi.number().min(0),
  other: Joi.number().min(0),
  total: Joi.number().min(0),
  expiryDate: Joi.date(),
});

// Main organization schema
const createOrginization = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    user: Joi.string().custom(objectId),

    address: Joi.string().trim().allow(null, ""),
    city: Joi.string().trim().allow(null, ""),
    state: Joi.string().trim().allow(null, ""),
    country: Joi.string()
      .valid(...Object.values(countries)),

    zipCode: Joi.string().trim().allow(null, ""),
    leaves: leaveJoi,
  })
}

const updateOrginizationById = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim(),
    address: Joi.string().trim().allow(null, ""),
    city: Joi.string().trim().allow(null, ""),
    state: Joi.string().trim().allow(null, ""),
    country: Joi.string()
      .valid(...Object.values(countries)),
    zipCode: Joi.string().trim().allow(null, ""),
    leaves: leaveJoi,
  }).min(1)
}

const getOrginizationById = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId).required(),
  }),
};
const getAllOrginizations = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    clientId: Joi.string().custom(objectId),
    main: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    orgType: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const uploadLogo = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    removeImage: Joi.string(),
  })
}
module.exports = {
  createOrginization,
  updateOrginizationById,
  getOrginizationById,
  getAllOrginizations,
  uploadLogo
};