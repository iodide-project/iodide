// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import React from 'react'
import { addOutputHandler } from './components/output.jsx'

export const nb_api = {
  'addOutputHandler': addOutputHandler
}

export default nb_api
