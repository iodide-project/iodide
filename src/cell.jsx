// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.

import React, {createElement} from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from '@skidding/react-codemirror'
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
        this.handleCellClick = this.handleCellClick.bind(this)
        this.enterEditMode = this.enterEditMode.bind(this)
        this.inputComponent = this.inputComponent.bind(this)
        this.outputComponent = this.outputComponent.bind(this)
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

    handleCellClick(){
        var scrollToCell = false
        this.props.actions.selectCell(this.props.cell.id,scrollToCell)
        if (this.props.pageMode=='edit'){
            this.props.actions.changeMode('command')
        }
    }

    enterEditMode(){
        this.props.actions.selectCell(this.props.cell.id)
        this.props.actions.changeMode('edit')
        if (this.hasEditor) this.refs.editor.focus()
    }

    inputComponent(){
        return <div></div>
    }

    outputComponent(){
        return <div></div>
    }

    makeButtons(){
        return (
            <div className={'cell-controls ' + (
                (this.props.cell.selected &&
                            this.props.pageMode == 'command') ? 'controls-visible' : 'controls-invisible')}>
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
        var cellContainerStyle = ((this.props.display ? '' : 'hidden-cell ') +
            (this.props.cell.selected ? 'selected-cell ' : ' ') + 
            (this.props.cell.selected && this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ')
            )
        return (
            <div id={'cell-'+ this.props.cell.id}
                className={'cell-container '+ cellContainerStyle}
                onMouseDown={this.handleCellClick} >
                <div className="cell-row">
                    <div id = {"cell-input-status-"+ this.props.cell.id}
                        className ={"cell-status cell-input " + this.props.cell.cellType}>
                        [{this.props.cell.executionStatus}]
                    </div>
                    {this.inputComponent()}
                </div>
                <div className='cell-row'>
                    <div id = {"cell-output-status-"+ this.props.cell.id}
                        className ={"cell-status cell-output " + this.props.cell.cellType}>
                        {/* eventually we may wish to add ouptut status here, a la jupyter */}
                    </div>
                    {this.outputComponent()}
                </div>
                {this.makeButtons()}
            </div>
        )
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
                className={'cell-container ' + (this.props.display ? '' : 'hidden-cell') +
                    (this.props.cell.selected ? 'selected-cell ' : ' ')}>
                <div 
                    className={'cell dom-cell '  + 
                        (this.props.cell.selected &&
                            this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ')}
                    onClick={this.handleCellClick}>

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
        this.inputComponent = this.inputComponent.bind(this)
        this.outputComponent = this.outputComponent.bind(this)
    }

    updateCell(content) {
        this.props.actions.updateCell(this.props.cell.id, content)
    }

    inputComponent(){
        return <div></div>
    }

    outputComponent(){
        return <div></div>
    }

    render() {
        var cellContainerStyle = ((this.props.display ? '' : 'hidden-cell ') +
            (this.props.cell.selected ? 'selected-cell ' : ' ') + 
            (this.props.cell.selected && this.props.pageMode == 'edit' ? 'edit-mode ' : 'command-mode ')
            )
        return (
            <div id={'cell-'+ this.props.cell.id}
                className={'cell-container '+ cellContainerStyle}
                onMouseDown={this.handleCellClick} >
                <div style={{display:"none"}}>
                    <i onClick={this.deleteCell}
                        className={"fa fa-times " + (this.state.showControls ? 'controls-visible' : 'controls-invisible')}
                        aria-hidden="true">
                    </i>
                </div>
                <div className="cell-row">
                    <div id = {"cell-input-status-"+ this.props.cell.id}
                        className ={"cell-status cell-input " + this.props.cell.cellType}>
                        [{this.props.cell.executionStatus}]
                    </div>
                    {this.inputComponent()}
                    
                </div>
                <div className='cell-row'>
                    <div id = {"cell-output-status-"+ this.props.cell.id}
                        className ={"cell-status cell-output " + this.props.cell.cellType}>
                        {/* eventually we may wish to add ouptut status here, a la jupyter */}
                    </div>
                    {this.outputComponent()}
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

    inputComponent(){
        var options = {
            lineNumbers: true,
            mode: this.props.cell.cellType,
            lineWrapping: this.props.cell.cellType == 'markdown',
            theme: 'eclipse'
        }
        return (
            <div className="editor" onClick={this.enterEditMode}>
                <CodeMirror ref='editor' key={'cell-'+this.props.cell.id}
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.enterEditMode}
                    options={options} />
            </div>
        )
    }

    outputComponent(){
        return jsReturnValue(this.props.cell)
    }
}

class ExternalScriptCell extends RunnableCell {
    constructor(props) {
        super(props)
    }

    inputComponent(){
        var options = {
            lineNumbers: false,
            mode: this.props.cell.cellType,
            lineWrapping: this.props.cell.cellType == 'markdown',
            theme: 'eclipse'
        }
        return (
            <div className="editor" onClick={this.enterEditMode}>
                <CodeMirror ref='editor'
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.enterEditMode}
                    options={options} />
            </div>
        )
    }

    outputComponent(){
        return <div></div>
    }
}

class RawCell extends RunnableCell {
    constructor(props) {
        super(props)
    }

    inputComponent(){
        var options = {
            lineNumbers: false,
            mode: this.props.cell.cellType,
            lineWrapping: this.props.cell.cellType == 'markdown',
            theme: 'eclipse'
        }
        return (
            <div className="editor" onClick={this.enterEditMode}>
                <CodeMirror ref='editor'
                    value={this.props.cell.content}
                    onChange={this.updateCell} 
                    onFocus={this.enterEditMode}
                    options={options} />
            </div>
        )
    }
    outputComponent(){
        return <div></div>
    }
}


class MarkdownCell extends RunnableCell {
    constructor(props){
        super(props)
        this.enterEditMode = this.enterEditMode.bind(this)
    }

    enterEditMode(){
        super.enterEditMode()
        this.props.actions.markCellNotRendered(this.props.cell.id)
    }

    inputComponent(){
        // the editor is shown if this cell is being edited
        // or if !this.props.cell.rendered
        var editorDisplayStyle = (
            !this.props.cell.rendered ||
            (this.props.cell.selected
                && this.props.pageMode == 'edit')
        ) ? "block" : "none"

        var options = {
            lineNumbers: false,
            mode: this.props.cell.cellType,
            lineWrapping: this.props.cell.cellType == 'markdown',
            theme: 'eclipse'
        }

        var cmInstance = <CodeMirror ref='editor'
            value={this.props.cell.content}
            onChange={this.updateCell} 
            onFocus={this.enterEditMode}
            options={options} />

        if (this.props.cell.selected && this.refs.hasOwnProperty('editor') && this.props.pageMode == 'edit') {
            this.refs.editor.getCodeMirror().refresh()
            this.refs.editor.focus()
        }
        var mainElem
            mainElem = (
                <div className="editor"
                    style = {{display: editorDisplayStyle}}
                    onClick={this.enterEditMode}>
                    {cmInstance}
                </div>
            )
        return mainElem
    }

    outputComponent() {
        // the rendered MD is shown if this cell is NOT being edited
        // and if this.props.cell.rendered
        var resultDisplayStyle = ((
            this.props.cell.rendered &&
            !(this.props.cell.selected
                && this.props.pageMode == 'edit')
        ) ? "block" : "none")
        return <div onDoubleClick={this.enterEditMode}
            style = {{display: resultDisplayStyle}}
            dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>
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