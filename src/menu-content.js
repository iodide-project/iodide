import { prettyDate, formatDateString } from './notebook-utils'
import exampleNotebooks from './example-notebooks'
import settings from './settings'
import { stateFromJsmd } from './jsmd-tools'


const { AUTOSAVE } = settings.labels

const oscpu = window.navigator.oscpu || window.navigator.platform
let OSName = 'Unknown OS'
if (oscpu.indexOf('Win') !== -1) OSName = 'Windows'
if (oscpu.indexOf('Mac') !== -1) OSName = 'MacOS'
if (oscpu.indexOf('X11') !== -1) OSName = 'UNIX'
if (oscpu.indexOf('Linux') !== -1) OSName = 'Linux'

function commandKey(key) {
  let ctr = 'Ctrl '
  if (OSName === 'MacOS') {
    ctr = '⌘ '
  }
  return ctr + key
}


function getSavedNotebooks(elem) {
  const openLocalStorageNotebook = name => () => {
    elem.props.actions.loadNotebook(name)
  }

  const openExampleNotebook = (notebook) => {
    const nbs = exampleNotebooks
    const thisNotebook = notebook
    return () => {
      const matchingNotebook = nbs.filter(nb => nb.title === thisNotebook.title)[0]
      elem.props.actions.importNotebook(matchingNotebook)
    }
  }

  let currentNotebooks = []
  let autosaveNBs = []
  let savedNBs = []
  let exampleNBs = []

  const autosaves = Object.keys(localStorage).filter(n => n.includes(AUTOSAVE))

  if (autosaves.length) {
    const [autosave] = autosaves
    let { lastSaved } = jsonOrJsmdParse(localStorage[autosave])
    lastSaved = (lastSaved !== undefined) ? prettyDate(formatDateString(lastSaved)) : ' '
    const displayTitle = autosave.replace(AUTOSAVE, '')
    autosaveNBs = [
      {
        name: 'Auto-Saved',
        itemType: 'Subheader',
      },
      {
        primaryText: displayTitle,
        secondaryText: lastSaved,
        callback: openLocalStorageNotebook(autosave),
      },
    ]
  }
  const saves = Object.keys(localStorage)
  if (saves.length) {
    savedNBs = saves
      .filter(n => !n.includes(AUTOSAVE))
      .filter((n) => {
        try {
          jsonOrJsmdParse(localStorage[n]).lastSaved // eslint-disable-line
          return true
        } catch (err) {
          return false
        }
      })
      .map((n) => {
        const { lastSaved } = jsonOrJsmdParse(localStorage[n])
        return {
          primaryText: n,
          secondaryText: prettyDate(formatDateString(lastSaved)),
          callback: openLocalStorageNotebook(n),
          lastSaved: Date.parse(lastSaved),
        }
        // return <MenuItem
        //  primaryText={n}
        //  secondaryText={prettyDate(formatDateString(lastSaved))}
        // />
      })
    savedNBs.sort((a, b) => b.lastSaved - a.lastSaved)
    savedNBs.unshift({ name: 'Saved Notebooks', itemType: 'Subheader' })
  }
  exampleNBs = exampleNotebooks.map((nb) => {
    const { lastSaved } = nb
    return {
      primaryText: nb.title,
      secondaryText: prettyDate(formatDateString(lastSaved)),
      callback: openExampleNotebook(nb),
    }
    // return <MenuItem
    //  primaryText={nb.title}
    //  secondaryText={prettyDate(formatDateString(lastSaved))}
    // />
  })

  exampleNBs.unshift({ name: 'Examples', itemType: 'Subheader' })

  if (exampleNBs.length && (autosaveNBs.length || savedNBs.length)) {
    exampleNBs.unshift({ itemType: 'Divider' })
  }

  if (savedNBs.length && autosaveNBs.length) {
    savedNBs.unshift({ itemType: 'Divider' })
  }

  currentNotebooks = currentNotebooks.concat(autosaveNBs).concat(savedNBs).concat(exampleNBs)
  return currentNotebooks
}

const menuItems = {}


menuItems.newNotebook = {
  primaryText: 'New Notebook',
  secondaryText: commandKey('N'),
  callback() { this.props.actions.newNotebook() },
}

menuItems.saveNotebook = {
  primaryText: 'Save Notebook',
  secondaryText: commandKey('S'),
  callback() { this.props.actions.saveNotebook() },
}

menuItems.deleteNotebook = {
  primaryText: 'Delete Notebook',
  secondaryText: ' ',
  callback() { this.deleteNotebook(this.props.title) },
}

menuItems.exportNotebookAsJSON = {
  primaryText: 'Export Notebook',
  secondaryText: commandKey('E'),
  callback() { this.props.actions.exportNotebook() },
}
menuItems.importNotebookFromJSON = {
  primaryText: 'Import from JSON',
  callback() {
    document.getElementById('import-notebook').click()
  },
}

menuItems.savedNotebooks = {
  primaryText: 'Saved Notebooks',
  menuItems: getSavedNotebooks,
  childrenClass: 'large-menu',
}


menuItems.addCellBelow = {
  primaryText: 'Add Cell Below',
  secondaryText: 'B',
  callback() { this.props.actions.insertCell('javascript', 'below') },
}

menuItems.addCellAbove = {
  primaryText: 'Add Cell Above',
  secondaryText: 'A',
  callback() { this.props.actions.insertCell('javascript', 'above') },
}

menuItems.deleteCell = {
  primaryText: 'Delete Cell',
  secondaryText: '\u21E7 \u232b',
  callback() {
    if (this.props.mode === 'command') {
      this.props.actions.deleteCell()
    }
  },
}
menuItems.foldUnfoldAllCells = { primaryText: 'Fold / Unfold All Cells' }

menuItems.moveCellUp = {
  primaryText: 'Move Cell Up',
  secondaryText: '\u21E7 \u2191',
  callback() {
    this.props.actions.cellUp()
  },
}
menuItems.moveCellDown = {
  primaryText: 'Move Cell Down',
  secondaryText: '\u21E7 \u2193',
  callback() {
    this.props.actions.cellDown()
  },
}
menuItems.changeCellTypeToJavascript = {
  primaryText: 'Javascript',
  secondaryText: 'J',
  callback() {
    this.props.actions.changeCellType('javascript')
  },
}
menuItems.changeCellTypeToMarkdown = {
  primaryText: 'Markdown',
  secondaryText: 'M',
  callback() {
    this.props.actions.changeCellType('markdown')
  },
}
menuItems.changeCellTypeToRaw = {
  primaryText: 'Raw',
  secondaryText: 'R',
  callback() {
    this.props.actions.changeCellType('raw')
  },
}
menuItems.changeCellTypeToExternal = {
  primaryText: 'External Dependencies',
  secondaryText: 'E',
  callback() {
    this.props.actions.changeCellType('external dependencies')
  },
}

menuItems.changeCellTypeToCSS = {
  primaryText: 'CSS',
  secondaryText: 'C',
  callback() {
    this.props.actions.changeCellType('css')
  },
}


menuItems.cell = {
  primaryText: 'Cell',
  childrenClass: 'medium-menu',
  menuItems: [
    menuItems.moveCellUp,
    menuItems.moveCellDown,
    menuItems.addCellBelow,
    menuItems.addCellAbove,
    menuItems.deleteCell,
    { itemType: 'Divider', className: 'cell-menu' },
    { itemType: 'Subheader', name: 'change cell type to ... ' },
    menuItems.changeCellTypeToJavascript,
    menuItems.changeCellTypeToMarkdown,
    menuItems.changeCellTypeToRaw,
    menuItems.changeCellTypeToExternal,
    menuItems.changeCellTypeToCSS,
  ],
}

menuItems.viewDeclaredVariables = {
  primaryText: 'Declared Variables',
  secondaryText: commandKey('D'),
  callback() {
    this.props.actions.changeSidePaneMode('declared variables')
  },
}

menuItems.viewHistory = {
  primaryText: 'Execution History',
  secondaryText: commandKey('H'),
  callback() {
    this.props.actions.changeSidePaneMode('history')
  },
}

menuItems.view = {
  primaryText: 'View',
  childrenClass: 'medium-menu',
  menuItems: [menuItems.viewDeclaredVariables, menuItems.viewHistory],
}

menuItems.fileAnIssue = {
  primaryText: 'File An Issue ... ',
  callback() {
    window.open('https://github.com/mozilla/javascript-notebook/issues/new')
  },
}

export { menuItems, getSavedNotebooks }
