import {prettyDate, formatDateString} from './notebook-utils'
import exampleNotebooks from './example-notebooks.js'
import settings from './settings.js'
const AUTOSAVE = settings.labels.AUTOSAVE

let oscpu = window.navigator.oscpu || window.navigator.platform
let OSName='Unknown OS'
if (oscpu.indexOf('Win')!=-1) OSName='Windows'
if (oscpu.indexOf('Mac')!=-1) OSName='MacOS'
if (oscpu.indexOf('X11')!=-1) OSName='UNIX'
if (oscpu.indexOf('Linux')!=-1) OSName='Linux'

function commandKey(key) {
  let ctr = 'Ctrl '
  if (OSName === 'MacOS') {
    ctr= '⌘ '
  }
  return ctr + key
}

//document.write('Your OS: '+OSName);

function getSavedNotebooks (elem) {

  let openLocalStorageNotebook = name => {
    return ()=>{
      elem.props.actions.loadNotebook(name)
    }   
  }

  let openExampleNotebook = notebook => {
    let nbs = exampleNotebooks
    let thisNotebook = notebook
    return () => {
      let notebook = nbs.filter((nb)=>{return nb.title === thisNotebook.title})[0]
      elem.props.actions.importNotebook(notebook)
    }
  }

  let currentNotebooks = []
  let autosaveNBs=[], savedNBs=[], exampleNBs=[]

  let autosave = Object.keys(localStorage).filter((n)=>n.includes(AUTOSAVE))

  if (autosave.length) {
    autosave = autosave[0]
    let lastSaved = JSON.parse(localStorage[autosave]).lastSaved
    if (lastSaved!== undefined) lastSaved = prettyDate(formatDateString(lastSaved))
    lastSaved = (lastSaved!== undefined) ? prettyDate(formatDateString(lastSaved)) : ' '
    let displayTitle = autosave.replace(AUTOSAVE, '')
    autosaveNBs = [
      {name: 'Auto-Saved', itemType: 'Subheader'},
      {primaryText: displayTitle, secondaryText: lastSaved, callback: openLocalStorageNotebook(autosave)}
    ]
  } 
  let saves = Object.keys(localStorage)
  if (saves.length) {
    savedNBs = saves
      .filter((n)=>!n.includes(AUTOSAVE))
      .filter((n)=> {
        try {
          JSON.parse(localStorage[n]).lastSaved
          return true
        } catch(err) {
          return false
        }
      })
      .map((n)=> {
        let lastSaved = JSON.parse(localStorage[n]).lastSaved
        return {primaryText:n, secondaryText: prettyDate(formatDateString(lastSaved)), callback: openLocalStorageNotebook(n)}
        // return <MenuItem
        // 	primaryText={n}
        // 	secondaryText={prettyDate(formatDateString(lastSaved))}
        // />
      })	
    savedNBs.unshift({name: 'Saved Notebooks', itemType: 'Subheader'})	
  }
  exampleNBs = exampleNotebooks.map((nb)=>{
    let lastSaved = nb.lastSaved
    return {primaryText: nb.title, secondaryText: prettyDate(formatDateString(lastSaved)), callback: openExampleNotebook(nb)}
    // return <MenuItem
    // 	primaryText={nb.title}
    // 	secondaryText={prettyDate(formatDateString(lastSaved))}
    // />
  })

  exampleNBs.unshift({name: 'Examples', itemType: 'Subheader'})
		
  if (exampleNBs.length && (autosaveNBs.length || savedNBs.length)) {
    exampleNBs.unshift({itemType: 'Divider'})
  }

  if (savedNBs.length && autosaveNBs.length) {
    savedNBs.unshift({itemType: 'Divider'})
  }

  currentNotebooks = currentNotebooks.concat(autosaveNBs).concat(savedNBs).concat(exampleNBs)
  return currentNotebooks
}

let menuItems = {}



menuItems.newNotebook = {
  primaryText: 'New Notebook', 
  secondaryText: commandKey('N'), 
  callback: function(){this.props.actions.newNotebook()}
}

menuItems.saveNotebook = {
  primaryText: 'Save Notebook', 
  secondaryText: commandKey('S'), 
  callback: function(){this.props.actions.saveNotebook()}
}

menuItems.deleteNotebook = {
  primaryText: 'Delete Notebook', 
  secondaryText:' ', 
  callback: function(){this.deleteNotebook(this.props.title)}
}

menuItems.exportNotebookAsJSON = {
  primaryText: 'Export as JSON',
  secondaryText: commandKey('E'),
  callback: function(){this.props.actions.exportNotebook()}
}
menuItems.importNotebookFromJSON = {
  primaryText: 'Import from JSON',
  callback: function(){document.getElementById('import-notebook').click()
  }}

menuItems.savedNotebooks = {
  primaryText: 'Saved Notebooks',
  menuItems: getSavedNotebooks,
  childrenClass: 'large-menu'
}


menuItems.addCellBelow = {
  primaryText: 'Add Cell Below', 
  secondaryText:'B',
  callback: function(){ this.props.actions.insertCell('javascript','below') }
}

menuItems.addCellAbove = {
  primaryText: 'Add Cell Above', 
  secondaryText:'A',
  callback: function(){ this.props.actions.insertCell('javascript','above') }
}

menuItems.deleteCell = {
  primaryText: 'Delete Cell', 
  secondaryText: '\u21E7 \u232b', 
  callback: function(){
    if (this.props.mode == 'command') {
      this.props.actions.deleteCell()
    }
  }
}
menuItems.foldUnfoldAllCells = {primaryText: 'Fold / Unfold All Cells'}

menuItems.moveCellUp = {
  primaryText: 'Move Cell Up', 
  secondaryText: '\u21E7 \u2191',
  callback: function(){
    this.props.actions.cellUp()
  }
}
menuItems.moveCellDown = {
  primaryText: 'Move Cell Down',
  secondaryText: '\u21E7 \u2193',
  callback: function(){
    this.props.actions.cellDown()
  }
}
menuItems.changeCellTypeToJavascript = {
  primaryText: 'Javascript', 
  secondaryText:'J', 
  callback: function(){
    this.props.actions.changeCellType('javascript')
  }
}
menuItems.changeCellTypeToMarkdown = {
  primaryText: 'Markdown', 
  secondaryText:'M',
  callback: function() {
    this.props.actions.changeCellType('markdown')
  }
}
menuItems.changeCellTypeToRaw = {
  primaryText: 'Raw', 
  secondaryText:'R',
  callback: function() {
    this.props.actions.changeCellType('raw')
  }
}
menuItems.changeCellTypeToExternal = {
  primaryText: 'External Dependencies', 
  secondaryText:'E',
  callback: function() {
    this.props.actions.changeCellType('external dependencies')
  }
}
menuItems.changeCellTypeToDOM= {
  primaryText: 'DOM', 
  secondaryText: ' ',
  callback: function() {
    this.props.actions.changeCellType('dom')
  }}

menuItems.cell = {
  primaryText: 'Cell',
  childrenClass: 'medium-menu',
  menuItems: [
    menuItems.moveCellUp,
    menuItems.moveCellDown,
    menuItems.addCellBelow, 
    menuItems.addCellAbove, 
    menuItems.deleteCell, 
    {itemType: 'Divider', className: 'cell-menu'},
    {itemType: 'Subheader', name: 'change cell type to ... '},
    menuItems.changeCellTypeToJavascript, 
    menuItems.changeCellTypeToMarkdown, 
    menuItems.changeCellTypeToRaw,
    menuItems.changeCellTypeToExternal, 
    menuItems.changeCellTypeToDOM
  ]
} 

menuItems.viewDeclaredVariables = {
  primaryText: 'Declared Variables',
  secondaryText: commandKey('D'),
  callback: function() {
    this.props.actions.changeSidePaneMode('declared variables')
  }
}

menuItems.viewHistory = {
  primaryText: 'Execution History',
  secondaryText: commandKey('H'),
  callback: function() {
    this.props.actions.changeSidePaneMode('history')
  }
}

menuItems.view = {
  primaryText: 'View',
  childrenClass:'medium-menu',
  menuItems: [menuItems.viewDeclaredVariables, menuItems.viewHistory]
}

menuItems.fileAnIssue = {primaryText: 'File An Issue ... ', callback: function(){
  window.open('https://github.com/mozilla/javascript-notebook/issues/new')
}}

export {menuItems, getSavedNotebooks}