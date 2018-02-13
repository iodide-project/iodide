import { stateFromJsmd } from './jsmd-tools'

import evictions from '../examples/eviction-notices-by-sf-neighborhood--1999-2015.json'
import introduction from '../examples/what-does-a-javascript-notebook-look-like-.json'
import output from '../examples/output-handling.json'
import webnotebook from '../examples/what-a-web-notebook-looks-like.jsmd'

const exampleNotebooks = []

// console.log(webnotebook)

exampleNotebooks.push(evictions)
exampleNotebooks.push(introduction)
exampleNotebooks.push(output)

const jsmdNotebooks = [
  webnotebook,
].map(stateFromJsmd)


// export default exampleNotebooks
export default jsmdNotebooks
