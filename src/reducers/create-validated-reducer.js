// adapted from https://github.com/Prismatik/redux-json-schema
// but npm wouldn't load the package correctly. No idea why.
// MIT licensed
import Ajv from "ajv";
import _ from "lodash";

export class SchemaValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "SchemaValidationError";
  }
}

const createValidatedReducer = (reducer, schema, options) => {
  const ajv = new Ajv(options);
  const validate = ajv.compile(schema);

  const validatedReducer = (state, action) => {
    const futureState = reducer(state, action);

    if (!validate(futureState)) {
      const badValues = {};
      validate.errors.forEach(error => {
        if (error.dataPath !== undefined) {
          const dataPath =
            error.dataPath[0] === "."
              ? error.dataPath.slice(1)
              : error.dataPath;
          badValues[dataPath] = _.get(futureState, dataPath);
        }
      });

      throw new SchemaValidationError(`${JSON.stringify(
        validate.errors,
        null,
        " "
      )}
bad values:
${JSON.stringify(badValues, null, " ")}`);
    }

    return futureState;
  };
  return validatedReducer;
};

export default createValidatedReducer;
