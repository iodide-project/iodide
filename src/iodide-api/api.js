// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import { addOutputHandler } from '../components/reps/value-renderer'
import { environment } from './environment'
import { evalQueue } from './evalQueue'
import { print, DOM } from './print'

function getDataSync(url) {
  const re = new XMLHttpRequest()
  re.open('GET', url, false)
  re.send(null)
  return re.response
}

export const iodide = {
  addOutputHandler,
  getDataSync,
  environment,
  evalQueue,
  print,
  DOM,
}

export default iodide
