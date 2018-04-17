import LZString from 'lz-string'
import _ from 'lodash'

import { saveEnvironment } from '../actions/actions'
import { store } from '../store'


//  FIXME replace all "throws" with iodide.print (when `print` is ready)

function saveToEnvironment(obj, options) {
  if (!_.isObject(obj)) {
    throw new TypeError('variables to be saved must be wrapped in object with var name for bundle')
  }

  const envObj = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (options.raw === true) {
      if (typeof v === 'string') {
        envObj[k] = ['rawString', v]
      } else {
        throw new TypeError('only strings can be bundled as raw strings')
      }
    } else if (typeof v === 'string') {
      envObj[k] = ['string', LZString.compressToBase64(v)]
    } else {
      envObj[k] = ['object', LZString.compressToBase64(JSON.stringify(v))]
    }
  })
  store.dispatch(saveEnvironment(envObj, options.update))
}

function decodeEnvObj(encoding, str) {
  switch (encoding) {
    case 'rawString':
      return str
    case 'object':
      return JSON.parse(LZString.decompressFromBase64(str))
    case 'string':
      return LZString.decompressFromBase64(str)
    default:
      throw new TypeError('JSMD env variables must have encoding "object", "string" or "rawString"')
  }
}

function loadFromEnvironment(varList) {
  varList.forEach((v) => {
    if (typeof v !== 'string') {
      throw new TypeError('environment.get only accepts one or more strings as parameters')
    }
  })
  const env = store.getState().savedEnvironment
  const valsOut = varList.map(v => decodeEnvObj(...env[v]))
  if (valsOut.length === 1) { return valsOut[0] }
  return valsOut
}

export const environment = {
  // set: obj => saveToEnvironment(obj, { raw: false, update: false }),
  // setRawString: obj => saveToEnvironment(obj, { raw: true, update: false }),
  freeze: obj => saveToEnvironment(obj, { raw: false, update: true }),
  freezeRawString: obj => saveToEnvironment(obj, { raw: true, update: true }),

  clear: () => saveToEnvironment({}, { raw: false, update: false }),

  get: (...vars) => loadFromEnvironment(vars),

  list: () => Object.keys(store.getState().savedEnvironment),
}
