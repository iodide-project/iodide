// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.


import React from 'react';
import JSONTree from 'react-json-tree';
import CodeMirror from 'react-codemirror';


class JSCell extends React.Component {
	constructor(props) {
		super(props);
		//this.state = {code: '', value: undefined, selected: false};

		//this.updateCode = this.updateCode.bind(this);
		// this.runCell = this.runCell.bind(this);
		// this.selected = this.selected.bind(this);

		// this.cellUp = this.cellUp.bind(this);
		// this.cellDown = this.cellDown.bind(this);
		// this.deleteCell = this.deleteCell.bind(this);
	}

	updateCell(content) {
		this.props.actions.updateCell(this.props.cell.id, content);
		//this.props.actions.update
		//this.setState({code: code})
	}

	runCell() {
		this.props.actions.renderCell(this.props.cell.id);
		// this.props.interpreter.appendCode(this.state.code);
		// this.props.interpreter.run();
		// this.setState({value: this.props.interpreter.value});
		// this.props.onCellRun(this.props.index);
	}

	selected() {
		this.setState({selected: true});
	}

	cellUp(){
		this.props.actions.cellUp(this.props.cell.id);
	}

	cellDown(){
		this.props.actions.cellDown(this.props.cell.id);
	}

	deleteCell(){
		//this.props.onDeleteCell(this.props.index);
		this.props.actions.deleteCell(this.props.cell.id);
	}

	render() {
		var options = {
			lineNumbers: true,
			mode: 'javascript',
			theme: 'eclipse'
		}
	
		var resultElem;
		var returnedSomething;
		if (this.props.cell.value == undefined) returnedSomething = false;
		if (typeof this.props.cell.value == 'object' && this.props.cell.value.hasOwnProperty('type') && this.props.cell.value.type !='undefined') returnedSomething = true;
		if (returnedSomething) {
			resultElem = <JSONTree data={this.props.cell.value} hideRoot={true} theme={{
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

		return (<div className='js-cell' >
			<CodeMirror ref="editor" value={this.props.cell.content} onChange={this.updateCell.bind(this)} options={options} autoFocus={true} />
			<button onClick={this.runCell.bind(this)}>run</button><button >type</button>
			<button onClick={this.cellDown.bind(this)} >down</button>
			<button onClick={this.cellUp.bind(this)}>up</button>
			<button onClick={this.deleteCell.bind(this)}>delete</button>
			<div className='result'>				
					{resultElem}
			</div>
		</div>)

	}
}

export default JSCell;