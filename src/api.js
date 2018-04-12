// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook
import LZString from 'lz-string'
import _ from 'lodash'

import { store } from './store'
import { addOutputHandler } from './components/reps/value-renderer'
import { saveEnvironment as saveEnvironmentAction } from './actions/actions'


function getDataSync(url) {
  const re = new XMLHttpRequest()
  re.open('GET', url, false)
  re.send(null)
  return re.response
}

function saveEnvironment(obj) {
  if (!_.isObject(obj)) {
    throw new TypeError('variables to be saved must be wrapped in object')
  }
  const envObj = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (typeof v === 'string') {
      envObj[k] = LZString.compressToBase64(v)
    } else {
      throw new TypeError('variables to be saved must be serialized as strings')
    }
  })
  if (Object.keys(envObj).length > 0) {
    store.dispatch(saveEnvironmentAction(envObj))
  }
}

function loadEnvironment() {
  return _.mapValues(
    store.getState().savedEnvironment,
    v => LZString.decompressFromBase64(v),
  )
}

export const iodide = {
  addOutputHandler,
  getDataSync,
  saveEnvironment,
  loadEnvironment,
}

export default iodide
