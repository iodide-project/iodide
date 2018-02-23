import { stateFromJsmd } from './jsmd-tools'

import evictions from '../examples/evictions.jsmd'
import output from '../examples/output-handling.jsmd'
import webnotebook from '../examples/what-a-web-notebook-looks-like.jsmd'
import python from '../examples/python.jsmd'

const jsmdNotebooks = [
  webnotebook,
  output,
  evictions,
  python,
].map(stateFromJsmd)


// export default exampleNotebooks
export default jsmdNotebooks
