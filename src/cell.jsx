// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.

import React, {createElement} from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from '@skidding/react-codemirror'
import marksy from 'marksy'
const MD_COMPILER = marksy({createElement})

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, 
        SplitButton, FormGroup, FormControl, ControlLabel, Form, Col } from 'react-bootstrap'

class GenericCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {showControls:false}
        this.hasEditor = false
        // explicitly bind "this" for all methods in constructors
        this.renderCell = this.renderCell.bind(this)
        this.cellUp = this.cellUp.bind(this)
        this.cellDown = this.cellDown.bind(this)
        this.deleteCell = this.deleteCell.bind(this)
        this.changeCellType = this.changeCellType.bind(this)
        this.selectCell = this.selectCell.bind(this)
        this.showControls = this.showControls.bind(this)
        this.hideControls = this.hideControls.bind(this)
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
        if (this.hasEditor) this.refs.editor.focus()
    }

    showControls(){this.setState({showControls:true})}
    hideControls(){this.setState({showControls:false})}

    makeButtons(){
        return (
            <div className={'cell-controls ' + (this.state.showControls ? 'controls-visible' : 'controls-invisible')}>
                <ButtonToolbar >

                    <Button bsSize='xsmall' onClick={this.renderCell}><i className="fa fa-play" aria-hidden="true"></i></Button>
                    <Button bsSize='xsmall' onClick={this.cellDown}><i className="fa fa-level-down" aria-hidden="true"></i></Button>
                    <Button bsSize='xsmall' onClick={this.cellUp}><i className="fa fa-level-up" aria-hidden="true"></i></Button>
                      <DropdownButton bsSize="xsmall" id={'cell-choice-' + this.props.id}
                        bsStyle='default' title={this.props.cell.cellType}
                        onSelect={this.changeCellType} >
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


class DOMCell extends GenericCell {

    constructor(props) {
        super(props)
        if (!props.cell.hasOwnProperty('elementType')) props.actions.changeElementType(props.cell.id, 'div')
        if (!props.cell.hasOwnProperty('domElementID')) props.actions.changeDOMElementID(props.cell.id, 'dom-cell-'+props.cell.id)
        // explicitly bind "this" for all methods in constructors
        this.changeElementType = this.changeElementType.bind(this)
        this.changeElementID = this.changeElementID.bind(this)
    }

    changeElementType(event) {
        var elementType = event.target.value.trim()
        this.props.actions.changeElementType(this.props.cell.id, elementType)
    }

    changeElementID(event) {
        var elementID = event.target.value.trim()
        this.props.actions.changeDOMElementID(this.props.cell.id, elementID)
    }

    render() {
        var elem
        if (this.props.cell.elementType.length) elem = createElement(this.props.cell.elementType, {id: this.props.cell.domElementID})
        else {
            elem = <div className='dom-cell-error'>please add an elem type</div>
        }
        return (
            <div id={'cell-'+ this.props.cell.id}
                onMouseOver={this.showControls} 
                onMouseOut={this.hideControls} 
                className={'cell-container ' + (this.props.display ? '' : 'hidden-cell') +
                    (this.props.cell.selected ? 'selected-cell ' : ' ')}>
                <div 
                    className={'cell dom-cell '  + 
                        (this.props.cell.selected &&
                            this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ')}
                    onClick={this.selectCell}>

                    <div className='dom-cell-elementType' 
                        style={{display: this.props.cell.selected ? 'inherit' : 'none'}}>
                        
                        <Form className='dom-inputs' inline>
                            <FormGroup bsSize='xsmall' controlId={'dom-'+this.props.cell.id}>
                                <ControlLabel className='right-spacer'>tag</ControlLabel>
                                  <FormControl className='right-spacer' type="text"
                                    onChange={this.changeElementType}
                                    value={this.props.cell.elementType}
                                    placeholder="div, svg, etc." />
                                  <ControlLabel className='right-spacer'>css ID</ControlLabel>
                                  <FormControl type="text" onChange={this.changeElementID}
                                    value={this.props.cell.domElementID} placeholder="id"  />
                            </FormGroup>
                        </Form>
                    </div>
                    {elem}
                </div>
                {this.makeButtons()}
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
                    <div className='history-content'>{mainElem}</div>
                    <div className='history-date'>{this.props.cell.lastRan.toUTCString()}</div>
                </div>
                <div className={'cell-controls'}></div>
            </div>
            )
    }
}


class RunnableCell extends GenericCell {
    constructor(props){
        super(props)
        this.hasEditor = true
        // explicitly bind "this" for all methods in constructors
        this.updateCell = this.updateCell.bind(this)
        this.mainComponent = this.mainComponent.bind(this)
        this.resultComponent = this.resultComponent.bind(this)
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
        var cellContainerStyle = ('cell-container ' + 
            (this.props.display ? '' : 'hidden-cell ') +
            (this.props.cell.selected ? 'selected-cell ' : ' ') + 
            (this.props.cell.selected && this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ')
            )
        return (
            <div id={'cell-'+ this.props.cell.id}
                className={cellContainerStyle}
                onMouseEnter={this.showControls}
                onMouseLeave={this.hideControls}
                onMouseDown={this.selectCell} >
                <div id = {"cell-execution-status-"+ this.props.cell.id}
                    className ={"cell-execution-status " + this.props.cell.cellType}>
                    [{this.props.cell.executionStatus}]
                </div>
                <div style={{display:"none"}}>
                    <i onClick={this.deleteCell}
                        className={"fa fa-times " + (this.state.showControls ? 'controls-visible' : 'controls-invisible')}
                        aria-hidden="true">
                    </i>
                </div>
                <div className={'cell '  +
                    (this.props.cell.rendered ? 'rendered ' : 'unrendered ')}>
                    {this.mainComponent()}
                    <div className='result'> {this.resultComponent()} </div>
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
        return <CodeMirror ref='editor' key={'cell-'+this.props.cell.id}
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.selectCell}
                    options={options} />
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
        return <CodeMirror ref='editor'
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.selectCell}
                    options={options} />
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
        return <CodeMirror ref='editor'
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.selectCell}
                    options={options} />
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
                onChange={this.updateCell} 
                onFocus={this.selectCell}
                options={options} />
        } else {
            mainElem = <div onDoubleClick={()=>this.unrender.bind(this)(false)}
                dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>
        }
        return mainElem
    }

    resultComponent() {
        // there is none.
    }
}


function jsReturnValue(cell) {
    var resultElem;
    var returnedSomething
    if (cell.value == undefined && !cell.rendered) returnedSomething = false
    if (cell.value !== undefined) returnedSomething = true
    if (cell.value == undefined && cell.rendered) returnedSomething = true
    if (returnedSomething) {
        resultElem = <JSONTree data={cell.value} hideRoot={false} theme={{
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

export {JavascriptCell, MarkdownCell, RawCell, HistoryCell, ExternalScriptCell, DOMCell};