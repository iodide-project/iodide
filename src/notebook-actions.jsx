import React from 'react'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem } from 'react-bootstrap'

/*

save
save as
load
new notebook

*/

class NotebookActions extends React.Component {
	constructor(props) {
		super(props)
	}

	selectMenuItem(menuItem, evt) {
		if (menuItem=='saveNotebook') this.props.actions.saveNotebook()
		if (menuItem=='deleteNotebook') this.props.actions.deleteNotebook(this.props.currentTitle)
	}

	loadNotebook(notebookName) {
		this.props.actions.loadNotebook(notebookName)
	}

	render() {
		var notebookNames = Object.keys(localStorage).map((n)=> {
			return <MenuItem eventKey={n} key={n} id={n}> {n} </MenuItem>
		})
		if (notebookNames.length) {
			notebookNames = <DropdownButton onSelect={this.loadNotebook.bind(this)} bsSize="xsmall" title='Notebooks' id='load-notebook'> {notebookNames} </DropdownButton>
		}
		return (
			<div className='notebook-actions'>
				<ButtonToolbar>
					<DropdownButton bsSize="xsmall" id='main-menu' bsStyle='default' title="Menu" onSelect={this.selectMenuItem.bind(this)} >
						<MenuItem   eventKey={"saveNotebook"} >Save Notebook</MenuItem>
						<MenuItem   eventKey={"deleteNotebook"} >Delete Notebook</MenuItem>
						<MenuItem   eventKey={'new'} >New Notebook</MenuItem>
					</ DropdownButton>
						{notebookNames}
				</ButtonToolbar>
			</div>
		)
	}
}

export default NotebookActions