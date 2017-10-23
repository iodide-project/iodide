import React from 'react'
// import { Button, ButtonToolbar, ToggleButtonGroup, 
// 	ToggleButton, Label, DropdownButton, MenuItem, Dropdown,
// 	Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap'
import settings from './settings.jsx'


import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {red500, yellow500, blue500, grey900,grey50} from 'material-ui/styles/colors';


import FlatButton from 'material-ui/FlatButton';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import DropDownMenu from 'material-ui/DropDownMenu';
import Subheader from 'material-ui/Subheader';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import FontIcon from 'material-ui/FontIcon'

import MainMenu from './menu-component.jsx'

import {prettyDate, formatDateString} from './notebook-utils'

// TODO: replace settings w/ a settings file that we can share everywhere.


const AUTOSAVE = settings.labels.AUTOSAVE


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
			console.log(notebook)
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
		return (
		<div>
			<input id='import-notebook' 
			    	name='file'
			    	type='file' style={{display:'none'}} onChange={this.notebookFileImport} 
			    />
			<a id='export-anchor' style={{display: 'none'}} ></a>
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<Toolbar style={{backgroundColor: 'black'}}>
						<MainMenu 
								isFirstChild={true}
								actions={this.props.actions} 
								cells={this.props.cells}
								mode={this.props.mode}
								viewMode={this.props.viewMode}
								sidePaneMode={this.props.sidePaneMode}
								lastSaved={this.props.lastSaved}
								currentTitle={this.props.title}  />
						<ViewModeToggleButton actions={this.props.actions} viewMode={this.props.viewMode} />
				</Toolbar>	
		  	</MuiThemeProvider>
		</div>
		)
	}
}


class ViewModeToggleButton extends React.Component {
    constructor(props) {
        super(props)
        this.toggleViewMode = this.toggleViewMode.bind(this)
    }

    toggleViewMode(){
        if (this.props.viewMode=="presentation") {
            this.props.actions.setViewMode("editor")
        } else if (this.props.viewMode=="editor"){
            this.props.actions.setViewMode("presentation")
        }
    }

    render() {
        var buttonString;
        if (this.props.viewMode=="presentation"){buttonString="Presentation"}
        else if (this.props.viewMode=="editor"){buttonString="Editor"}
        return (
            <ToolbarGroup id='notebook-view-mode-controls' className='mode-buttons'>
                <FlatButton style={{color:'#fafafa'}} onClick={this.toggleViewMode} hoverColor={'darkgray'} label={buttonString} />
            </ToolbarGroup>
        )
    }
}

export default NotebookMenu