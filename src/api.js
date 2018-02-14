// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import { addOutputHandler } from './components/output'

export const io = {
  addOutputHandler,
}

export default io
