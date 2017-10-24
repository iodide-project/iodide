import {prettyDate, formatDateString, getSelectedCell} from './notebook-utils'
import exampleNotebooks from './example-notebooks.jsx'
import settings from './settings.jsx'
const AUTOSAVE = settings.labels.AUTOSAVE

var OSName="Unknown OS";
if (navigator.oscpu.indexOf("Win")!=-1) OSName="Windows"
if (navigator.oscpu.indexOf("Mac")!=-1) OSName="MacOS"
if (navigator.oscpu.indexOf("X11")!=-1) OSName="UNIX"
if (navigator.oscpu.indexOf("Linux")!=-1) OSName="Linux"

function commandKey(key) {
    let ctr = 'Ctrl-'
    if (OSName === 'MacOS') {
        ctr= '⌘ '
    }
    return ctr + key
}



//document.write('Your OS: '+OSName);

function getSavedNotebooks (elem) {

    var openLocalStorageNotebook = name => {
        return ()=>{
            elem.props.actions.loadNotebook(name)
        }   
    }

    var openExampleNotebook = notebook => {
        var nbs = exampleNotebooks
        var thisNotebook = notebook
        return () => {
            var notebook = nbs.filter((nb)=>{return nb.title === thisNotebook.title})[0]
			elem.props.actions.importNotebook(notebook)
        }
    }

    var currentNotebooks = []
		var autosaveNBs=[], savedNBs=[], exampleNBs=[]

		var autosave = Object.keys(localStorage).filter((n)=>n.includes(AUTOSAVE))

		if (autosave.length) {
            autosave = autosave[0]
            var lastSaved = JSON.parse(localStorage[autosave]).lastSaved
            if (lastSaved!== undefined) lastSaved = prettyDate(formatDateString(lastSaved))
            lastSaved = (lastSaved!== undefined) ? prettyDate(formatDateString(lastSaved)) : ' '
			var displayTitle = autosave.replace(AUTOSAVE, '')
			autosaveNBs = [
                {name: 'Auto-Saved', itemType: 'Subheader'},
                {primaryText: displayTitle, secondaryText: lastSaved, callback: openLocalStorageNotebook(autosave)}
			]
		} 
		var saves = Object.keys(localStorage)
		if (saves.length) {
			savedNBs = saves.filter((n)=>!n.includes(AUTOSAVE)).map((n)=> {
                var lastSaved = JSON.parse(localStorage[n]).lastSaved
                return {primaryText:n, secondaryText: prettyDate(formatDateString(lastSaved)), callback: openLocalStorageNotebook(n)}
				// return <MenuItem
				// 	primaryText={n}
				// 	secondaryText={prettyDate(formatDateString(lastSaved))}
				// />
			})	
			savedNBs.unshift({name: 'Saved Notebooks', itemType: 'Subheader'})	
        }
		exampleNBs = exampleNotebooks.map((nb)=>{
            var lastSaved = nb.lastSaved
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

var menuItems = {}



menuItems.newNotebook = {
    primaryText: 'New Notebook', 
    secondaryText: commandKey('N'), 
    callback: function(){this.props.actions.newNotebook()}
}

menuItems.saveNotebook = {
    primaryText: 'Save Notebook', 
    secondaryText: commandKey("S"), 
    callback: function(){this.props.actions.saveNotebook()}
}

menuItems.deleteNotebook = {
    primaryText: 'Delete Notebook', 
    secondaryText:" ", 
    callback: function(){this.deleteNotebook(this.props.title)}
}

menuItems.exportNotebookAsJSON = {
    primaryText: 'Export as JSON',
    callback: function(){this.props.actions.exportNotebook()}
}
menuItems.importNotebookFromJSON = {
    primaryText: 'Import from JSON',
    callback: function(){document.getElementById('import-notebook').click()
}}

menuItems.savedNotebooks = {
    primaryText: 'Saved Notebooks',
    menuItems: getSavedNotebooks
}


menuItems.addCellBelow = {primaryText: 'Add Cell Below', secondaryText:'B'}
menuItems.addCellAbove = {primaryText: 'Add Cell Above', secondaryText:'A'}
menuItems.deleteCell = {
    primaryText: 'Delete Cell', 
    secondaryText: '\u21E7 \u232b', 
    callback: function(){
        var currentlySelected = getSelectedCell(this.props.cells)
        if (currentlySelected != undefined
            && this.props.mode == 'command') {
            this.props.actions.deleteCell(currentlySelected.id)
        }
    }
}
menuItems.foldUnfoldAllCells = {primaryText: 'Fold / Unfold All Cells'}

menuItems.moveCellUp = {
    primaryText: 'Move Cell Up', 
    secondaryText: '\u21E7 \u2191',
    callback: function(){
       this.props.actions.cellUp(getSelectedCell(this.props.cells).id)
    }
}
menuItems.moveCellDown = {
    primaryText: 'Move Cell Down',
    secondaryText: '\u21E7 \u2193',
    callback: function(){
        this.props.actions.cellDown(getSelectedCell(this.props.cells).id)
    }
}
menuItems.changeCellTypeToJavascript = {
    primaryText: 'Javascript', 
    secondaryText:'J', 
    callback: function(){
        this.props.actions.changeCellType(getSelectedCell(this.props.cells).id, 'javascript')
    }
}
menuItems.changeCellTypeToMarkdown = {
    primaryText: 'Markdown', 
    secondaryText:'M',
    callback: function() {
        this.props.actions.changeCellType(getSelectedCell(this.props.cells).id, 'markdown')
    }
}
menuItems.changeCellTypeToRaw = {
    primaryText: 'Raw', 
    secondaryText:'R',
    callback: function() {
        this.props.actions.changeCellType(getSelectedCell(this.props.cells).id, 'raw')
    }
}
menuItems.changeCellTypeToExternal = {
    primaryText: 'External Scripts', 
    secondaryText:'E',
    callback: function() {
        this.props.actions.changeCellType(getSelectedCell(this.props.cells).id, 'external scripts')
    }
}
menuItems.changeCellTypeToDOM= {
    primaryText: 'DOM', 
    secondaryText: ' ',
    callback: function() {
        this.props.actions.changeCellType(getSelectedCell(this.props.cells).id, 'dom')
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

menuItems.fileAnIssue = {primaryText: 'File An Issue'}

export {menuItems, getSavedNotebooks}