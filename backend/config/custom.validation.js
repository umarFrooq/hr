// Joi custom validation
const ApiError=require('../utils/ApiError')
const { responseMessages } = require("../utils/response.message");

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" '+ responseMessages.CUSTOM_VALIDATION_MODULE.ID_MUST_BE_VALID_MONGO_ID)
    }
    return value;
};
const checkEmptyVal = (value, helpers) => {
    if (value && value.length) {
      value = value.trim();
      if (value == "")
        return helpers.message(responseMessages.CUSTOM_VALIDATION_MODULE.VALUE_MUST_HAVE_LENTH);
    }
    return value;
  }
  const dateValidation = (to, from) => {
    if (to && new Date(to).getTime() > new Date().getTime())
      throw new ApiError(400,`${responseMessages.TO_DATE_CANNOT_BE_GREATER_THAN_TODAY}`);
    if (from && new Date(from).getTime() > new Date().getTime())
      throw new ApiError(400,`${responseMessages.FROM_DATE_CANNOT_BE_GREATER_THAN_TODAY}`);
    if (to && from && new Date(to).getTime() < new Date(from).getTime())
      throw new ApiError(400,`${responseMessages.FROM_DATE_CANNOT_BE_GREATER_THAN_TO_DATE}`);
  };
  const checkNameValidity = (value, helpers) => {
    if (/[^a-zA-Z\s]/.test(value)) {
      return helpers.error(responseMessages.CUSTOM_VALIDATION_MODULE.INVALID_NAME_FORMATE);
    }
    return value;
  };

module.exports = {
    objectId,checkEmptyVal,dateValidation,checkNameValidity
};