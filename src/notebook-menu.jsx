import React from 'react'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, Dropdown } from 'react-bootstrap'
import settings from './settings.jsx'
import exampleNotebooks from './example-notebooks.jsx'

// TODO: replace settings w/ a settings file that we can share everywhere.


const AUTOSAVE = settings.labels.AUTOSAVE

function formatDateString(d) {
  var d = new Date(d)
  return d.toUTCString()
}

function stateIsValid(state) {
	// TODO - fill this out and figure out if everything is in order.
	return state !== undefined // for now ...
}

class NotebookMenu extends React.Component {
	constructor(props) {
		super(props)
		this.changeMode = this.changeMode.bind(this)
		this.handleNotebookSelection = this.handleNotebookSelection.bind(this)
		this.notebookFileImport = this.notebookFileImport.bind(this)
		this.selectMenuItem = this.selectMenuItem.bind(this)
		this.state = {previousMode: props.mode}
	}

	selectMenuItem(menuItem, evt) {
		if (menuItem=='saveNotebook') this.props.actions.saveNotebook()
		if (menuItem=='deleteNotebook') this.props.actions.deleteNotebook(this.props.currentTitle)
		if (menuItem=='exportNotebook') this.props.actions.exportNotebook()
		if (menuItem=='importNotebook') document.getElementById('import-notebook').click()//triggers notebookFileImport
		if (menuItem=='newNotebook') {
			this.props.actions.newNotebook()
			//this.props.actions.addCell('javascript')
		}
	}

	handleNotebookSelection(notebook, evt) {
		if (notebook.notebookType === 'saved' || notebook.notebookType === 'autosave') {
			//this.props.actions.newNotebook()
			this.props.actions.loadNotebook(notebook.title)
		}

		if (notebook.notebookType === 'example') {

			var notebook = exampleNotebooks.filter((nb)=>{return nb.title === notebook.title})[0]


			this.props.actions.importNotebook(notebook)

		}
	}

	changeMode(mode) {
		if (mode == 'editor-modes') {
			this.props.actions.changeMode(this.state.previousMode)
		}
		else {
			this.setState({previousMode: this.props.mode})
			this.props.actions.changeMode(mode)
		}
	}

	changeSidePaneMode(sidePaneMode) {
		if (this.props.sidePaneMode === sidePaneMode) this.props.actions.changeSidePaneMode(undefined)
		else this.props.actions.changeSidePaneMode(sidePaneMode)
	}

	notebookFileImport(evt) {
		var fn = evt.target.files[0]
		var reader = new FileReader()
		reader.onload = (result) => {
			var newState
			try {
				newState = JSON.parse(result.target.result)	
			} catch(e) {
				console.error(e)
			}
			
			if (stateIsValid(newState)) {
				this.props.actions.importNotebook(newState)
			}
			
		}
		reader.readAsText(fn)
	}

	render() {
		
		var notebookMenuItems = []
		var autosaveNBs=[], savedNBs=[], exampleNBs=[]

		var autosave = Object.keys(localStorage).filter((n)=>n.includes(AUTOSAVE))

		if (autosave.length) {
			autosave = autosave[0]
			var lastSaved = formatDateString(JSON.parse(localStorage[autosave]).lastSaved)
			var displayTitle = autosave.replace(AUTOSAVE, '')
			autosaveNBs = [
				<MenuItem eventKey={{notebookType:'autosave', title: autosave}} 
					key={autosave} 
					id={autosave}> 
						<span className="menu-notebook-name"><span className='notebook-label'>auto</span> {displayTitle}</span> 
						<span className="menu-last-saved">{lastSaved}</span> 
				</MenuItem>
			]
		} 
		var saves = Object.keys(localStorage)
		if (saves.length) {
			savedNBs = saves.filter((n)=>!n.includes(AUTOSAVE)).map((n)=> {
				var lastSaved = JSON.parse(localStorage[n]).lastSaved
				return <MenuItem 
					eventKey={{notebookType:'saved', title:n}} 
					key={'SAVED: '+n} 
					id={'SAVED: '+ n}> 
						<span className="menu-notebook-name">{n}</span> 
						<span className="menu-last-saved">{formatDateString(lastSaved)}</span> 
					</MenuItem>
			})	
			savedNBs.unshift(<MenuItem key='saved-notebooks-header' header>Saved Notebooks </MenuItem>)	
		}
		exampleNBs = exampleNotebooks.map((nb)=>{
			var lastSaved = nb.lastSaved
			return <MenuItem 
				eventKey={{notebookType: 'example', title:nb.title}} 
				key={settings.labels.EXAMPLE+nb.title} 
				id={settings.labels.EXAMPLE+nb.title}
			>
						<span className="menu-notebook-name">{nb.title}</span> 
						<span className="menu-last-saved">{formatDateString(lastSaved)}</span> 
			</MenuItem>
		})

		exampleNBs.unshift(<MenuItem key='example-notebooks-header' header>Example Notebooks </MenuItem>)
		
		if (exampleNBs.length && (autosaveNBs.length || savedNBs.length)) {
			exampleNBs.unshift(<MenuItem key='example-notebook-divider' divider />)
		}

		if (savedNBs.length && autosaveNBs.length) {
			savedNBs.unshift(<MenuItem key='saved-notebook-divider' divider />)
		}

		notebookMenuItems = notebookMenuItems.concat(autosaveNBs).concat(savedNBs).concat(exampleNBs)

		if (notebookMenuItems.length) {
			notebookMenuItems = <Dropdown id='notebook-menu-items' onSelect={this.handleNotebookSelection} > 
				<Dropdown.Toggle bsSize="xsmall">Notebooks</Dropdown.Toggle>
				<Dropdown.Menu className='load-notebook-menu'> {notebookMenuItems} </Dropdown.Menu>
			</Dropdown>
		}


		var currentTitle = this.props.currentTitle !== undefined ? this.props.currentTitle : 'new notebook'

		return (
			<div className='notebook-actions'>
			    <input id='import-notebook' 
			    	name='file'
			    	type='file' style={{display:'none'}} onChange={this.notebookFileImport} 
			    />
          		<a id='export-anchor' style={{display: 'none'}} ></a>
				<ButtonToolbar id='notebook-actions'>
					<DropdownButton id='notebook-action-dropdown' bsSize="xsmall" id='main-menu' bsStyle='default' title="Menu" onSelect={this.selectMenuItem} >
						<MenuItem id='save-notebook-item'  eventKey={"saveNotebook"} >Save <span className='menu-item-title'>{currentTitle}</span></MenuItem>
						<MenuItem id='delete-notebook-item'  eventKey={"deleteNotebook"} >Delete <span className='menu-item-title'>{currentTitle}</span></MenuItem>
						<MenuItem id='import-notebook-item'  eventKey={"importNotebook"} >Import Notebook</MenuItem>
						<MenuItem id='export-notebook-item'  eventKey={"exportNotebook"} >Export Notebook</MenuItem>
						<MenuItem id='new-notebook-item'  eventKey={'newNotebook'} >New Notebook</MenuItem>
					</ DropdownButton>
					{notebookMenuItems}
                    <Button bsSize='xsmall'onClick={ ()=>{this.changeSidePaneMode('history')} }>History</Button>
                    <Button bsSize='xsmall'onClick={()=>{this.changeSidePaneMode('declared variables')} }>Declared Variables</Button>
				</ButtonToolbar>
				<ButtonToolbar id='notebook-view-mode-controls' className='mode-buttons'>
					<Button bsSize='xsmall' onClick={ ()=>{this.changeMode('editor-modes')} }>Editor</Button>
					<Button bsSize='xsmall'>Presentation</Button>
				</ButtonToolbar>
			</div>
		)
	}
}

export default NotebookMenu