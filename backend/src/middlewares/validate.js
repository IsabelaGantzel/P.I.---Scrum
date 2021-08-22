/**
 * Create a validation middleware by a Joi Schema model
 *
 * @param schema Joi Schema
 * @returns
 */
function validate(schema, picker = (req) => req.body) {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // include all errors
    };
    const { error, value } = schema.validate(picker(req), options);
    if (error) {
      const errors = error.details.map((x) => x.message);
      res.status(400).json({
        error: `Validation error: ${errors.join(", ")}`,
        errors,
      });
    } else {
      req.body = value;
      next();
    }
  };
}

module.exports = validate;
