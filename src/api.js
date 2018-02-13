// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import { addOutputHandler } from './components/output.jsx'

export const iodideApi = {
  'addOutputHandler': addOutputHandler
}

// This is called on every new object in a cell or external dependency.
// If it looks like an iodideSetup plugin callback, it is called.
export function handlePlugin(name, value) {
  if (name === 'iodideSetup' && typeof value === 'function') {
    value(iodideApi)
  }
}

export default iodideApi
