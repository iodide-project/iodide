import Ajv from 'ajv'

import { languageSchema, historySchema } from '../state-schemas/state-schema'
// these are the schemas of actions from the eval frame that
// are ok to pass to the editor

const languageActionSchema = Object.assign({}, languageSchema)
languageActionSchema.properties.type = { type: 'string' }


const historyActionSchema = Object.assign({}, historySchema)
historyActionSchema.properties.type = { type: 'string' }

const schemas = {
  ADD_LANGUAGE_TO_EVAL_FRAME: languageActionSchema,
  APPEND_TO_EVAL_HISTORY: historyActionSchema,
  CLEAR_CONSOLE_TEXT_CACHE: null,
  CONSOLE_HISTORY_MOVE: {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: { type: 'string' },
      consoleCursorDelta: { type: 'integer' },
    },
  },
  // FIXME environment actions disabled for now
  // ENVIRONMENT_UPDATE_FROM_EDITOR: {
  // },
  // ENVIRONMENT_UPDATE_FROM_EVAL_FRAME: {
  // },
  RESET_HISTORY_CURSOR: null,
  // FIXME environment actions disabled for now
  // SAVE_ENVIRONMENT: {
  // },
  UPDATE_CONSOLE_TEXT: {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: { type: 'string' },
      consoleText: { type: 'string' },
    },
  },
  UPDATE_USER_VARIABLES: {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: { type: 'string' },
      userDefinedVarNames: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
  UPDATE_VALUE_IN_HISTORY: {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: { type: 'string' },
      historyId: { type: 'integer' },
    },
  },
}

const memoizedValidators = () => {
  const cachedValidators = {}
  return (type) => {
    if (type in cachedValidators) {
      return cachedValidators[type]
    }

    const ajv = new Ajv()
    const validator = ajv.compile(schemas[type])
    cachedValidators[type] = validator
    return cachedValidators[type]
  }
}

const validator = memoizedValidators()

export default function validateActionFromEvalFrame(action) {
  if (!action.type) {
    console.warn('Got invalid message from eval frame: No action type')
    return false
  } else if (!Object.keys(schemas).includes(action.type)) {
    console.warn('Got invalid message from eval frame: action type not permitted')
    return false
  } else if (Object.keys(action).length === 1 && Object.keys(action)[0] === 'type') {
    // this is an action that only has a type and no payload
    return true
  } else if (!validator(action.type)(action)) {
    console.warn(`Got invalid message from eval frame: bad schema
schema error:
${JSON.stringify(validator(action.type).errors, null, ' ')}
action causing error:
${JSON.stringify(action, null, ' ')}`)
    return false
  }

  return true
}
