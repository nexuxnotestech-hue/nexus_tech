const ApiError = require("../utils/ApiError");

/**
 * Joi schema validator middleware
 * Usage: validate(schemaObject)
 * @param {Object} schema - Joi schema with optional body/query/params keys
 */
const validate = (schema) => (req, res, next) => {
  const validationErrors = [];

  if (schema.body) {
    const { error } = schema.body.validate(req.body, { abortEarly: false });
    if (error) {
      validationErrors.push(...error.details.map((d) => d.message));
    }
  }

  if (schema.query) {
    const { error } = schema.query.validate(req.query, { abortEarly: false });
    if (error) {
      validationErrors.push(...error.details.map((d) => d.message));
    }
  }

  if (schema.params) {
    const { error } = schema.params.validate(req.params, { abortEarly: false });
    if (error) {
      validationErrors.push(...error.details.map((d) => d.message));
    }
  }

  if (validationErrors.length > 0) {
    return next(new ApiError(422, validationErrors.join(", "), validationErrors));
  }

  next();
};

module.exports = validate;
