import React from 'react'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, Dropdown } from 'react-bootstrap'
import settings from './settings.jsx'
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
		this.state = {previousMode: props.mode, exampleBooks:[]}
	}

	selectMenuItem(menuItem, evt) {
		if (menuItem=='saveNotebook') this.props.actions.saveNotebook()
		if (menuItem=='deleteNotebook') this.props.actions.deleteNotebook(this.props.currentTitle)
		if (menuItem=='exportNotebook') this.props.actions.exportNotebook()
		if (menuItem=='importNotebook') document.getElementById('import-notebook').click()//triggers notebookFileImport
	}

	loadNotebook(notebookName) {
		this.props.actions.loadNotebook(notebookName)
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
		
		
		var notebookMenuItems = Object.keys(localStorage).filter((n)=>!n.includes(AUTOSAVE)).map((n)=> {
			var lastSaved = JSON.parse(localStorage[n]).lastSaved
			return <MenuItem eventKey={n} key={n} id={n}> <span className="menu-notebook-name">{n}</span> <span className="menu-last-saved">{formatDateString(lastSaved)}</span> </MenuItem>
		})

		var autosave = Object.keys(localStorage).filter((n)=>n.includes(AUTOSAVE))
		if (autosave.length) {

			autosave = autosave[0]
			var lastSaved = formatDateString(JSON.parse(localStorage[autosave]).lastSaved)
			var displayTitle = autosave.replace(AUTOSAVE, '')
			notebookMenuItems = [...[
				<MenuItem eventKey={autosave} 
					key={autosave} 
					id={autosave}> 
						<span className="menu-notebook-name"><span className='notebook-label'>auto</span> {displayTitle}</span> 
						<span className="menu-last-saved">{lastSaved}</span> 
				</MenuItem>,
				<MenuItem divider />,
				<MenuItem header>Saved Notebooks</ MenuItem>
				],
				, ...notebookMenuItems
			]
		}

		if (notebookMenuItems.length) {
			notebookMenuItems = <Dropdown onSelect={this.loadNotebook.bind(this)} > 
				<Dropdown.Toggle bsSize="xsmall">Notebooks</Dropdown.Toggle>
				<Dropdown.Menu className='load-notebook-menu'> {notebookMenuItems} </Dropdown.Menu>
			</Dropdown>
		}



		var currentTitle = this.props.currentTitle !== undefined ? this.props.currentTitle : 'new notebook'
		return (
			<div className='notebook-actions'>
			    <input id='import-notebook' 
			    	name='file'
			    	type='file' style={{display:'none'}} onChange={this.notebookFileImport.bind(this)} 
			    />
          		<a id='export-anchor' style={{display:'none'}} ></a>
				<ButtonToolbar>
					<DropdownButton bsSize="xsmall" id='main-menu' bsStyle='default' title="Menu" onSelect={this.selectMenuItem.bind(this)} >
						<MenuItem   eventKey={"saveNotebook"} >Save <span className='menu-item-title'>{currentTitle}</span></MenuItem>
						<MenuItem   eventKey={"deleteNotebook"} >Delete <span className='menu-item-title'>{currentTitle}</span></MenuItem>
						<MenuItem   eventKey={"importNotebook"} >Import Notebook</MenuItem>
						<MenuItem   eventKey={"exportNotebook"} >Export Notebook</MenuItem>
						<MenuItem   eventKey={'new'} >New Notebook</MenuItem>
					</ DropdownButton>
						{notebookMenuItems}
				</ButtonToolbar>
				<ButtonToolbar className='mode-buttons'>
					<Button bsSize='xsmall' onClick={()=>{this.changeMode('editor-modes')}}>Editor</Button>
					<Button bsSize='xsmall'onClick={()=>{this.changeMode('history')}}>History</Button>
				</ButtonToolbar>
			</div>
		)
	}
}

export default NotebookMenu