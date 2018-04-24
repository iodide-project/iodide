// adapted from https://github.com/Prismatik/redux-json-schema
// but npm wouldn't load the package correctly. No idea why.
// MIT licensed
import Ajv from 'ajv'

class SchemaValidationError extends Error {
  constructor(message) {
    super(message)
    this.message = message
    this.name = 'SchemaValidationError'
  }
}

const createValidatedReducer =
  (reducer, schema, options) => {
    const ajv = new Ajv(options)
    const validate = ajv.compile(schema)

    const validatedReducer = (state, action) => {
      const futureState = reducer(state, action)

      if (!validate(futureState)) {
        throw new SchemaValidationError(ajv.errorsText(validate.errors, { verbose: true }))
      }

      return futureState
    }
    return validatedReducer
  }

export default createValidatedReducer
