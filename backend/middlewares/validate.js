/**
 * Joi validator middleware for routes level validation to check if the request body,params and query is valid
 */

/**
 * @param {Object} schema - Joi schema object
 * @returns {Function}
 * @example
 * const schema = Joi.object({
 * body: Joi.object({
 *  name: Joi.string().required(),
 * email: Joi.string().required(),
 * password: Joi.string().required(),
 * }),
 */

const Joi = require("joi");
const {status} = require('http-status');
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick")
const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" } })
        .validate(object);

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(", ");

        return next(new ApiError(status.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;