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


function saveToEnvironment(obj, options) {
  if (!_.isObject(obj)) {
    throw new TypeError('variables to be saved must be wrapped in object')
  }
  let encode
  if (options.stringify && options.compress) {
    encode = x => LZString.compressToBase64(JSON.stringify(x))
  } else if (options.stringify && !options.compress) {
    encode = x => JSON.stringify(x)
  } else if (!options.stringify && options.compress) {
    encode = x => LZString.compressToBase64(x)
  } else {
    encode = x => x
  }

  const envObj = {}
  Object.keys(obj).forEach((k) => {
    const v = encode(obj[k])
    if (typeof v === 'string') {
      envObj[k] = v
    } else {
      throw new TypeError('variables to be saved must be serialized as strings')
    }
  })
  if (Object.keys(envObj).length > 0) {
    store.dispatch(saveEnvironmentAction(envObj))
  }
}

function loadFromEnvironment(varList, options) {
  const env = store.getState().savedEnvironment
  let decode
  if (options.stringified && options.compressed) {
    decode = x => JSON.parse(LZString.decompressFromBase64(x))
  } else if (options.stringified && !options.compressed) {
    decode = x => JSON.parse(x)
  } else if (!options.stringified && options.compressed) {
    decode = x => LZString.decompressFromBase64(x)
  } else {
    decode = x => x
  }
  return _.zipObject(varList, varList.map(v => decode(env[v])))
}

const environment = {
  save: objects => saveToEnvironment(
    objects,
    { stringify: true, compress: true },
  ),
  saveStringCompressed: (...objects) => saveToEnvironment(
    objects,
    { stringify: false, compress: true },
  ),
  saveJson: objects => saveToEnvironment(
    objects,
    { stringify: true, compress: false },
  ),
  saveStringRaw: objects => saveToEnvironment(
    objects,
    { stringify: false, compress: false },
  ),
  load: (...vars) => loadFromEnvironment(
    vars,
    { stringified: true, compressed: true },
  ),
  loadJson: (...vars) => loadFromEnvironment(
    vars,
    { stringified: true, compressed: false },
  ),
  loadCompressedString: (...vars) => loadFromEnvironment(
    vars,
    { stringified: true, compressed: true },
  ),
  loadRawString: (...vars) => loadFromEnvironment(
    vars,
    { stringified: true, compressed: true },
  ),
}

export const iodide = {
  addOutputHandler,
  getDataSync,
  environment,
}

export default iodide
