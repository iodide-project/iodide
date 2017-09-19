// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.


import React, {createElement} from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from 'react-codemirror'
import marksy from 'marksy'
const MD_COMPILER = marksy({createElement})

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem } from 'react-bootstrap'

class GenericCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {showControls:false}
		this.selectCell = this.selectCell.bind(this)
		this.makeButtons = this.makeButtons.bind(this)
	}

	renderCell(render) {
		this.props.actions.renderCell(this.props.cell.id)
	}

	cellUp(){
		this.props.actions.cellUp(this.props.cell.id)
	}

	cellDown(){
		this.props.actions.cellDown(this.props.cell.id)
	}

	deleteCell(){
		this.props.actions.deleteCell(this.props.cell.id)
	}

	changeCellType(cellType, evt){
		this.props.actions.changeCellType(this.props.cell.id, cellType)
	}

	selectCell(){
		this.props.actions.renderCell(this.props.cell.id, false)
		this.props.actions.selectCell(this.props.cell.id)
		this.props.actions.changeMode('edit')
		this.refs.editor.focus()
	}

	showControls(){this.setState({showControls:true})}
	hideControls(){this.setState({showControls:false})}

	makeButtons(){
		return (
			<div className={'cell-controls ' + (this.state.showControls ? 'controls-visible' : 'controls-invisible')}>
				<ButtonToolbar >

					<Button bsSize='xsmall' onClick={this.renderCell.bind(this)}><i className="fa fa-play" aria-hidden="true"></i></Button>
					<Button bsSize='xsmall' onClick={this.cellDown.bind(this)}><i className="fa fa-level-down" aria-hidden="true"></i></Button>
					<Button bsSize='xsmall' onClick={this.cellUp.bind(this)}><i className="fa fa-level-up" aria-hidden="true"></i></Button>
	      			<DropdownButton bsSize="xsmall" id={'cell-choice-' + this.props.id} bsStyle='default' title={this.props.cell.cellType} onSelect={this.changeCellType.bind(this)} >
						<MenuItem   eventKey={"javascript"} >JS</MenuItem>
						<MenuItem   eventKey={'markdown'} >MD</MenuItem>
						<MenuItem   eventKey={'raw'} >Raw</MenuItem>
						<MenuItem   eventKey={'dom'} >DOM</MenuItem>
						<MenuItem   eventKey={'external scripts'} >External Script</MenuItem>
					</ DropdownButton>
				</ ButtonToolbar>
			</div>
		)
	}


	render() {

	}
}

class DependencyCell extends GenericCell {
	constructor(props) {
		super(props)

	}

	loadResource(resourceName, resourceType, src) {

		// resourcetype can be js or css.

		var head = document.getElementsByTagName('head')[0]
		var loader
		if (resourceType === 'javascript') {
			loader = document.createElement('script')
			loader.type = resourceType//'text/javascript';
			loader.src = src//"http://threejs.org/build/three.min.js";
		}
		else if (resourceType === 'css') {
			loader = document.createElement('link')
		}


		head.appendChild(loader);
	}

	render() {
		return (
			<div className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}>
				<div className='cell dependency-cell'>
					 <input value='dependency' />
				</div>
				<div className='cell-controls'>
					{this.makeButtons()}
				</div>
			</div>
		)
	}
}


class HistoryCell extends GenericCell {
	constructor(props) {
		super(props)
		this.state = {showControls:false}
	}

	render() {
		var options = {
			lineNumbers: true,
			readOnly: true,
			mode: this.props.cell.cellType,
			theme: 'eclipse'
		}
		var mainElem = <CodeMirror ref='editor'
						   value={this.props.cell.content}
						   options={options} />
		
		

		return (
			<div className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}>
				<div className='cell history-cell'>
					<div className='history-content'>
						{mainElem}
					</div>
						<div className='history-date'>{this.props.cell.lastRan.toUTCString()}</div>
				</div>
				

					<div className={'cell-controls'}>
					</div>
				</div>
			)
	}
}

class RunnableCell extends GenericCell {
	constructor(props){
		super(props)
	}

	updateCell(content) {
		this.props.actions.updateCell(this.props.cell.id, content)
	}

	mainComponent(){
		return <div></div>
	}

	resultComponent(){
		return <div></div>
	}

	render() {
		return (
			<div id={'cell-'+ this.props.cell.id}
			className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}
			onMouseEnter={this.showControls.bind(this)}
			onMouseLeave={this.hideControls.bind(this)}
			onMouseDown={this.selectCell} >
				<div style={{display:"none"}}><i onClick={this.deleteCell.bind(this)} className={"fa fa-times " + (this.state.showControls ? 'controls-visible' : 'controls-invisible')} aria-hidden="true"></i></div>
				<div className={'cell ' + 
					(this.props.cell.selected ? 'selected-cell ' : ' ') + 
					(this.props.cell.selected && this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ') +
					(this.props.cell.rendered ? 'rendered ' : 'unrendered ')
				}>
			
					{this.mainComponent.bind(this)()}

					<div className='result'>				
							{this.resultComponent.bind(this)()}
					</div>
				</div>

				{this.makeButtons()}

			</div>
		)
	}
}

class JavascriptCell extends RunnableCell {
	constructor(props){
		super(props)
	}

	mainComponent(){
		var options = {
			lineNumbers: true,//!this.props.cell.rendered,
			readOnly: this.props.cell.rendered,
			mode: this.props.cell.cellType,
			lineWrapping: this.props.cell.cellType == 'markdown',
			theme: 'eclipse'
		}
		return ( <CodeMirror ref='editor'
						   value={this.props.cell.content}
						   onChange={this.updateCell.bind(this)} 
						   onFocus={this.selectCell}
						   options={options} />
		)
	}

	resultComponent(){
		return jsReturnValue(this.props.cell)
	}
}

class ExternalScriptCell extends RunnableCell {
	constructor(props) {
		super(props)
	}

	mainComponent(){
		var options = {
			lineNumbers: false,//!this.props.cell.rendered,
			readOnly: this.props.cell.rendered,
			mode: this.props.cell.cellType,
			lineWrapping: this.props.cell.cellType == 'markdown',
			theme: 'eclipse'
		}
		var mainElem = <CodeMirror ref='editor'
						   value={this.props.cell.content}
						   onChange={this.updateCell.bind(this)} 
						   onFocus={this.selectCell}
						   options={options} />
		return mainElem
	}

	resultComponent(){
		return <div></div>
	}
}

class RawCell extends RunnableCell {
	constructor(props) {
		super(props)
	}

	mainComponent(){
		var options = {
			lineNumbers: false,//!this.props.cell.rendered,
			readOnly: this.props.cell.rendered,
			mode: this.props.cell.cellType,
			lineWrapping: this.props.cell.cellType == 'markdown',
			theme: 'eclipse'
		}
		var mainElem = <CodeMirror ref='editor'
						   value={this.props.cell.content}
						   onChange={this.updateCell.bind(this)} 
						   onFocus={this.selectCell}
						   options={options} />
		return mainElem
	}

	resultComponent(){
		return <div></div>
	}
}



class MarkdownCell extends RunnableCell {
	constructor(props){
		super(props)
	}

	mainComponent(){
		var options = {
			lineNumbers: false,//!this.props.cell.rendered,
			readOnly: this.props.cell.rendered,
			mode: this.props.cell.cellType,
			lineWrapping: this.props.cell.cellType == 'markdown',
			theme: 'eclipse'
		}
		var mainElem
		if (!this.props.cell.rendered) {
			mainElem = <CodeMirror ref='editor'
			   value={this.props.cell.content}
			   onChange={this.updateCell.bind(this)} 
			   onFocus={this.selectCell}
			   options={options} />
		} else {
			mainElem = <div onDoubleClick={()=>this.unrender.bind(this)(false)} dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>
		}
		return mainElem
	}

	resultComponent() {
		// there is none.
	}
}


function DisplayCell(name, displayType, props){
	var displayElem = createElement(displayType, Object.assign({}, props, {id: name}))
	return (
		<div>
			<span className='display-cell-title'>{name}</span>
			<span className='display-cell-type'>{displayType}</span>
			{displayElem}
		</div>
	)
}

function jsReturnValue(cell) {
	var resultElem;
	var returnedSomething
	if (cell.value == undefined && !cell.rendered) returnedSomething = false
	if (cell.value !== undefined) returnedSomething = true
	if (cell.value == undefined && cell.rendered) returnedSomething = true
	if (returnedSomething) {
		resultElem = <JSONTree data={cell.value} hideRoot={true} theme={{
			  scheme: 'bright',
			  author: 'chris kempson (http://chriskempson.com)',
			  base00: '#000000',
			  base01: '#303030',
			  base02: '#505050',
			  base03: '#b0b0b0',
			  base04: '#d0d0d0',
			  base05: '#e0e0e0',
			  base06: '#f5f5f5',
			  base07: '#ffffff',
			  base08: '#fb0120',
			  base09: '#fc6d24',
			  base0A: '#fda331',
			  base0B: '#a1c659',
			  base0C: '#76c7b7',
			  base0D: '#6fb3d2',
			  base0E: '#d381c3',
			  base0F: '#be643c'
			}} />
	} else {
		resultElem = <div className='empty-resultset'></div>;
	}
	return resultElem;
}

export {JavascriptCell, MarkdownCell, RawCell, HistoryCell, ExternalScriptCell};