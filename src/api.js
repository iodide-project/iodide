// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import { addLanguage } from './language'
import { addOutputHandler } from './components/output'
import { addTask } from './task-definitions'

export const iodide = {
  addLanguage,
  addOutputHandler,
  addTask,
}

export default iodide
