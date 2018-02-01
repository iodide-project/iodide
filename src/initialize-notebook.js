import { parseJsmd } from './jsmd-tools'
import { newNotebook, blankState, newCell} from './state-prototypes'

const jsmdCellTypeMap = new Map([
  ['js','javascript'],
  ['javascript','javascript'],
  ['md','markdown'],
  ['markdown','markdown'],
  ['external','external dependencies'],
  ['resource','external dependencies'],
  ['dom','dom'],
  ['raw','raw'],
])

function initializeNotebook(){
  let jsmdElt = document.getElementById('jsmd')
  if (jsmdElt){
    let {cells, parseWarnings} = parseJsmd(jsmdElt.innerHTML)
    console.log(parseWarnings)
    // initialize a blank notebook
    let initialState = blankState()
    // add top-level meta settings if any exist
    let meta = cells.filter(c=>c.cellType==='meta')[0]
    if (meta) {
      Object.assign(initialState, meta.content)
    }

    cells = cells
      .filter(c=>c.cellType!=='meta')
      .forEach(
        c => {
          let cell = Object.assign(
            newCell(initialState.cells, jsmdCellTypeMap.get(c.cellType)),
            c.settings,
            {content: c.content}
          )
          initialState.cells.push(cell)
        }
      )
    // set cell 0  to be the selected cell
    initialState.cells[0].selected = true
    return initialState
    // return newNotebook()
  } else {
    return newNotebook()
  }
}

export {initializeNotebook}