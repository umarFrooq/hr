const Joi = require("joi");
// const { objectId } = require("../../config/custom.validation");

const createTest = {
  body: Joi.object().keys({
    test1: Joi.string().required(),
    test2: Joi.string().required(),
  })
}

module.exports = {
  createTest
}