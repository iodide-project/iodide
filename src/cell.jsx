// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.


import React from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from 'react-codemirror'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label } from 'react-bootstrap'

class JSCell extends React.Component {
	constructor(props) {
		super(props);
	}

	updateCell(content) {
		this.props.actions.updateCell(this.props.cell.id, content);
	}

	runCell() {
		this.props.actions.renderCell(this.props.cell.id);
	}

	selected() {
	}

	cellUp(){
		this.props.actions.cellUp(this.props.cell.id);
	}

	cellDown(){
		this.props.actions.cellDown(this.props.cell.id);
	}

	deleteCell(){
		this.props.actions.deleteCell(this.props.cell.id);
	}

	changeCellType(cellType){
		this.props.actions.changeCellType(this.props.cell.id, cellType)
	}

	selectCell(){
		this.props.actions.selectCell(this.props.cell.id)
	}

	render() {
		var options = {
			lineNumbers: true,
			mode: this.props.cell.cellType,
			theme: 'eclipse'
		}
		var resultElem;
		if (this.props.cell.cellType === 'javascript') resultElem = jsReturnValue(this.props.cell);
		else if (this.props.cell.cellType === 'markdown') resultElem = this.props.cell.value;

		return (<div className={'js-cell ' + (this.props.cell.selected ? 'selected-cell' : '')} onClick={this.selectCell.bind(this)}>
			<CodeMirror ref="editor" value={this.props.cell.content} onChange={this.updateCell.bind(this)} onFocus={this.selectCell.bind(this)} options={options} autoFocus={true} />

			<ButtonToolbar >
				<Button bsSize='xsmall' onClick={this.runCell.bind(this)}>run</Button>
				<Button bsSize='xsmall' onClick={this.cellDown.bind(this)}>down</Button>
				<Button bsSize='xsmall' onClick={this.cellUp.bind(this)}>up</Button>
				<Button bsSize='xsmall' onClick={this.deleteCell.bind(this)}>delete</Button>
      			<ToggleButtonGroup type="radio" name="options"  onChange={this.changeCellType.bind(this)} defaultValue={this.props.cell.cellType}>
					<ToggleButton bsSize='xsmall'  value={"javascript"} >JS</ToggleButton>
					<ToggleButton bsSize='xsmall'  value={'markdown'} >MD</ToggleButton>
					<ToggleButton bsSize='xsmall'  value={'raw'} >Raw</ToggleButton>
				</ ToggleButtonGroup>
				<Label>{this.props.cell.cellType}</Label>
			</ ButtonToolbar>

			<div className='result'>				
					{resultElem}
			</div>
		</div>)

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

export default JSCell;