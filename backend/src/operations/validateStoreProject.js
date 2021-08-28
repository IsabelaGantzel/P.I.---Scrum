const Joi = require("joi");
const joiDefaultOptions = require("./joiDefaultOptions");

const schema = Joi.object({
  projectName: Joi.string().required(),
  managerPersonId: Joi.number().required(),
  clientPersonId: Joi.number().required(),
  devIds: Joi.array().default([]).unique().items(Joi.number().required()),
  startDate: Joi.number().required(),
});
const prefix = "Validation error: ";
const NAME = "ValidationError";

async function validateStoreProject({
  // ARGS
  projectName,
  managerPersonId,
  clientPersonId,
  devIds,
  startDate,
  // SELECT
  existsPersonById,
}) {
  const { error, value } = schema.validate(
    {
      projectName,
      managerPersonId,
      clientPersonId,
      devIds,
      startDate,
    },
    joiDefaultOptions
  );

  if (error) {
    const errors = error.details.map((x) => x.message);
    return {
      name: NAME,
      message: prefix + errors.join(", "),
      error: errors,
    };
  }

  const managerExists = await existsPersonById(managerPersonId);
  if (!managerExists) {
    return {
      name: NAME,
      message: prefix + `Manager with id equals '${managerPersonId}' not found`,
    };
  }

  const clientExists = await existsPersonById(clientPersonId);
  if (!clientExists) {
    return {
      name: NAME,
      message: prefix + `Client with id equals '${clientPersonId}' not found`,
    };
  }

  const devsExists = await Promise.all(
    devIds.map(async (personId) => {
      const exists = await existsPersonById(personId);
      return exists ? null : personId;
    })
  );

  const devsNotExists = devsExists.filter((id) => id !== null);
  if (devsNotExists.length > 0) {
    return {
      name: NAME,
      message:
        prefix + `Devs with ids equals '${devsNotExists.join(", ")}' not found`,
    };
  }

  return { value };
}

module.exports = validateStoreProject;
