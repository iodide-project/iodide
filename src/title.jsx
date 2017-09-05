import React, {createElement} from 'react'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label } from 'react-bootstrap'
// import ContentEditable from "react-contenteditable"

function formattedTitle(title) {
	return title !== undefined || title == '' ? title : 'new notebook'
}

class Title extends React.Component {
	constructor(props) {
		super(props)
		this.state = {title: formattedTitle(props.title), previousMode: props.pageMode}
	}

	changeTitle(evt) {
		// need 
		this.props.actions.changeMode('title-edit')
		this.props.actions.changePageTitle(evt.target.value)
		this.setState({title: formattedTitle(evt.target.value)})


	}

	onBlur() {
		if (this.props.pageMode == 'title-edit') this.props.actions.changeMode(this.state.previousMode)
	}

	render() {
		//var elem = <ContentEditable tagName={'h1'} className={'page-title'} onBlur={this.onBlur.bind(this)} onChange={this.changeTitle.bind(this)} html={this.state.title} />
		var elem = <input className='page-title' value={this.state.title} onChange={this.changeTitle.bind(this)} />
		return elem
	}
}

export default Title