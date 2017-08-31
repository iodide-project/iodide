// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.


import React, {createElement} from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from 'react-codemirror'
import marksy from 'marksy'
const MD_COMPILER = marksy({createElement})

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label } from 'react-bootstrap'

class Cell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {showControls:false}
		this.selectCell = this.selectCell.bind(this)
	}

	updateCell(content) {
		this.props.actions.updateCell(this.props.cell.id, content)
	}

	renderCell(render) {
		this.props.actions.renderCell(this.props.cell.id)
	}

	unrender() {
		this.props.actions.renderCell(this.props.cell.id, false)
	}

	selected() {
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

	changeCellType(cellType){
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

	render() {
		var options = {
			lineNumbers: !this.props.cell.rendered,
			readOnly: this.props.cell.rendered,
			mode: this.props.cell.cellType,
			theme: 'eclipse'
		}
		var resultElem, mainElem
		if (this.props.cell.cellType === 'javascript') resultElem = jsReturnValue(this.props.cell);
		else if (this.props.cell.cellType === 'markdown') resultElem = <div></div>//<div dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>

		if (this.props.cell.cellType === 'javascript' || this.props.cell.cellType === 'raw' || (this.props.cell.cellType === 'markdown' && !this.props.cell.rendered)) {
			mainElem = <CodeMirror ref='editor'
						   value={this.props.cell.content}
						   onChange={this.updateCell.bind(this)} 
						   onFocus={this.selectCell}
						   options={options} />

		} else if (this.props.cell.cellType === 'markdown' && this.props.cell.rendered) {
			mainElem = <div onDoubleClick={()=>this.unrender.bind(this)(false)} dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>
		} 
		return (
			<div className='cell-container' onMouseEnter={this.showControls.bind(this)} onMouseLeave={this.hideControls.bind(this)} >
				<div></div>
				<div className={'cell ' + 
					(this.props.cell.selected ? 'selected-cell ' : ' ') + 
					(this.props.cell.selected && this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ') +
					(this.props.cell.rendered ? 'rendered ' : 'unrendered ')
				} onClick={this.selectCell}>
			
					{mainElem}



					<div className='result'>				
							{resultElem}
					</div>
				</div>


				<div className={'cell-controls ' + (this.state.showControls ? 'controls-visible' : 'controls-invisible')}>
					<ButtonToolbar >
						<Button bsSize='xsmall' onClick={this.renderCell.bind(this)}>run</Button>
						<Button bsSize='xsmall' onClick={this.cellDown.bind(this)}>down</Button>
						<Button bsSize='xsmall' onClick={this.cellUp.bind(this)}>up</Button>
						<Button bsSize='xsmall' onClick={this.deleteCell.bind(this)}>delete</Button>
		      			<ToggleButtonGroup type="radio" name="options" value={this.props.cell.cellType} onChange={this.changeCellType.bind(this)} defaultValue={this.props.cell.cellType}>
							<ToggleButton bsSize='xsmall'  value={"javascript"} >JS</ToggleButton>
							<ToggleButton bsSize='xsmall'  value={'markdown'} >MD</ToggleButton>
							<ToggleButton bsSize='xsmall'  value={'raw'} >Raw</ToggleButton>
						</ ToggleButtonGroup>
						<Label>{this.props.cell.cellType}</Label>
					</ ButtonToolbar>
				</div>
			</div>
		)

	}
}

function jsReturnValue(cell) {
	var resultElem;
	var returnedSomething;
	if (cell.value == undefined) returnedSomething = false;
	if (typeof cell.value == 'object' && cell.value.hasOwnProperty('type') && cell.value.type !='undefined') returnedSomething = true;

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

export default Cell;