// a Page is a collection of cells. They are displayed in order. All javascript cells share
// the same interpreter.

import React, {createElement} from 'react'
import JSONTree from 'react-json-tree'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import CodeMirror from '@skidding/react-codemirror'
import matchbrackets from 'codemirror/addon/edit/matchbrackets'
import closebrackets from 'codemirror/addon/edit/closebrackets'

import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label, DropdownButton, MenuItem, 
        SplitButton, FormGroup, FormControl, ControlLabel, Form, Col } from 'react-bootstrap'

class GenericCell extends React.Component {
    /* Generic cell implements a basic cell with a code mirror editor
    in text-wrap mode (like MD or Raw), and with empty output component
    Override input/output components for different behavior
    */
    constructor(props) {
        super(props)
        this.hasEditor = true
        this.editorOptions = {
            lineNumbers: false,
            mode: this.props.cell.cellType,
            lineWrapping: false,
            theme: 'eclipse'
        }
        // explicitly bind "this" for all methods in constructors
        this.renderCell = this.renderCell.bind(this)
        this.cellUp = this.cellUp.bind(this)
        this.cellDown = this.cellDown.bind(this)
        this.deleteCell = this.deleteCell.bind(this)
        this.changeCellType = this.changeCellType.bind(this)
        this.handleCellClick = this.handleCellClick.bind(this)
        this.enterEditMode = this.enterEditMode.bind(this)
        this.handleCollapseButtonClick = this.handleCollapseButtonClick.bind(this)
        this.handleCollapseInputClick = this.handleCollapseInputClick.bind(this)
        this.handleCollapseOutputClick = this.handleCollapseOutputClick.bind(this)
        this.updateInputContent = this.updateInputContent.bind(this)
        this.inputComponent = this.inputComponent.bind(this)
        this.outputComponent = this.outputComponent.bind(this)
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

    handleCollapseButtonClick(rowType){
        console.log(rowType,
            this.props.cell.collapseEditViewInput,
            this.props.cell.collapseEditViewOutput,
            this.props.cell.collapsePresentationViewInput,
            this.props.cell.collapsePresentationViewOutput,
            this.props.viewMode
        )
        var currentCollapsedState,nextCollapsedState;
        console.log(this.props.viewMode + "," + rowType)
        switch (this.props.viewMode + "," + rowType){
            case "presentation,input":
              currentCollapsedState = this.props.cell.collapsePresentationViewInput
              break
            case "presentation,output":
              currentCollapsedState = this.props.cell.collapsePresentationViewOutput
              break
            case "editor,input":
              currentCollapsedState = this.props.cell.collapseEditViewInput
              break
            case "editor,output":
              currentCollapsedState = this.props.cell.collapseEditViewOutput
              break
        }
        switch (currentCollapsedState){
            case "COLLAPSED":
              nextCollapsedState = "EXPANDED"
              break
            case "EXPANDED":
              nextCollapsedState = "SCROLLABLE"
              break
            case "SCROLLABLE":
              nextCollapsedState = "COLLAPSED"
              break
        }
        console.log(currentCollapsedState,nextCollapsedState)
        this.props.actions.setCellCollapsedState(
            this.props.cell.id,
            this.props.viewMode,
            rowType,
            nextCollapsedState)
    }

    handleCollapseInputClick(){
        this.handleCollapseButtonClick("input")
    }

    handleCollapseOutputClick(){
        this.handleCollapseButtonClick("output")
    }

    updateInputContent(content) {
        this.props.actions.updateInputContent(this.props.cell.id, content)
    }

    inputComponent(){
        return (
            <div className="editor" onClick={this.enterEditMode}>
                <CodeMirror ref='editor'
                    value={this.props.cell.content}
                    onChange={this.updateInputContent} 
                    onFocus={this.enterEditMode}
                    options={this.editorOptions} />
            </div>
        )
    }

    outputComponent(){
        return <div ></div>
    }

    makeCellRow(rowType,collapse,collapseButtonHandler,
        executionStatus,mainComponent) {
        return (
            <div className={`cell-row ${rowType} ${collapse}`}>
                <div className ={"status"}>
                    {executionStatus}
                </div>
                <div className ={"collapse-button"}
                    onDoubleClick={collapseButtonHandler}>
                </div>
                <div className ={"main-component"}>
                    {mainComponent}
                </div>
            </div>
        )
    }

    render() {
        var cellSelected = this.props.cell.selected ? 'selected-cell ' : ''
        var editorMode = (
            (this.props.cell.selected && this.props.pageMode == 'edit') ?
            'edit-mode ' : 'command-mode '
        )
        var cellId = this.props.cell.id
        var cellType = this.props.cell.cellType
        var collapseInput, collapseOutput;
        if (this.props.viewMode=="presentation"){
            collapseInput = this.props.cell.collapsePresentationViewInput
            collapseOutput = this.props.cell.collapsePresentationViewOutput
        } else if (this.props.viewMode=="editor"){
            collapseInput = this.props.cell.collapseEditViewInput
            collapseOutput = this.props.cell.collapseEditViewOutput
        }

        return (
            <div id={'cell-'+ cellId}
                className={`cell-container ${cellSelected} ${editorMode} ${cellType}`}
                onMouseDown={this.handleCellClick} >
                {this.makeCellRow(
                    "input",
                    collapseInput,
                    this.handleCollapseInputClick,
                    `[${this.props.cell.executionStatus}]`,
                    this.inputComponent())}
                {this.makeCellRow("output",
                    collapseOutput,
                    this.handleCollapseOutputClick,
                    "",
                    this.outputComponent())}
            </div>
        )
    }
}

                // <div className={`cell-row cell-input ${collapseInput}`}>
                //     <div className ={"cell-status"}>
                //         [{this.props.cell.executionStatus}]
                //     </div>
                //     <div className ={"cell-collapse-button "}
                //         onDoubleClick={this.handleCollapseInputClick}></div>
                //     <div className ={"cell-main-component"}>
                //         {this.inputComponent()}
                //     <div>
                // </div>
                // <div className={`cell-row cell-output ${collapseOutput}`}>
                //     <div className ={"cell-status"}>
                //         {/* eventually we may wish to add ouptut status here, a la jupyter */}
                //     </div>
                //     <div className ={"cell-collapse-button"}
                //         onDoubleClick={this.handleCollapseOutputClick}></div>
                //     {this.outputComponent()}
                // </div>


class RawCell extends GenericCell {
    constructor(props) {
        super(props)
    }
}


class JavascriptCell extends GenericCell {
    constructor(props){
        super(props)
        this.editorOptions.lineNumbers = true
        this.editorOptions.matchBrackets = true
        this.editorOptions.autoCloseBrackets = true
        this.outputComponent = this.outputComponent.bind(this)
    }
    outputComponent(){
        return jsReturnValue(this.props.cell)
    }
}


class ExternalScriptCell extends GenericCell {
    constructor(props) {
        super(props)
    }
}


class MarkdownCell extends GenericCell {
    constructor(props){
        super(props)
        this.editorOptions.lineWrapping = true
        this.enterEditMode = this.enterEditMode.bind(this)
        this.inputComponent = this.inputComponent.bind(this)
        this.outputComponent = this.outputComponent.bind(this)
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

        var cmInstance = <CodeMirror ref='editor'
            value={this.props.cell.content}
            onChange={this.updateInputContent} 
            onFocus={this.enterEditMode}
            options={this.editorOptions} />

        if (this.props.cell.selected
            && this.refs.hasOwnProperty('editor') // FIXME-- is this needed?
            && this.props.pageMode == 'edit') {
            this.refs.editor.getCodeMirror().refresh()
            this.refs.editor.focus()
        }
        return (
            <div className="editor"
                style = {{display: editorDisplayStyle}}
                onClick={this.enterEditMode}>
                {cmInstance}
            </div>
        )
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



class DOMCell extends GenericCell {

    constructor(props) {
        super(props)
        if (!props.cell.hasOwnProperty('elementType')) props.actions.changeElementType(props.cell.id, 'div')
        if (!props.cell.hasOwnProperty('domElementID')) props.actions.changeDOMElementID(props.cell.id, 'dom-cell-'+props.cell.id)
        // explicitly bind "this" for all methods in constructors
        this.changeElementType = this.changeElementType.bind(this)
        this.changeElementID = this.changeElementID.bind(this)
        this.hasEditor = false
    }

    changeElementType(event) {
        var elementType = event.target.value.trim()
        this.props.actions.changeElementType(this.props.cell.id, elementType)
    }

    changeElementID(event) {
        var elementID = event.target.value.trim()
        this.props.actions.changeDOMElementID(this.props.cell.id, elementID)
    }

// FIXME!! need to Override enterEditMode for DOMCell
//     enterEditMode(){
//         this.props.actions.selectCell(this.props.cell.id)
//         this.props.actions.changeMode('edit')
//         if (this.hasEditor) this.refs.editor.focus()
//     }

    inputComponent(){
        return (
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
        )
    }

    outputComponent(){
        var elem
        if (this.props.cell.elementType.length) {
            elem = createElement(this.props.cell.elementType, {id: this.props.cell.domElementID})
        } else {
            elem = <div className='dom-cell-error'>please add an elem type</div>
        }
        return elem
    }
}


class HistoryCell extends GenericCell {
    constructor(props) {
        super(props)
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



function jsReturnValue(cell) {
    var resultElem;
    var returnedSomething
    if (cell.value == undefined && !cell.rendered) returnedSomething = false
    if (cell.value !== undefined) returnedSomething = true
    if (cell.value == undefined && cell.rendered) returnedSomething = true
    if (returnedSomething) {
        resultElem = <JSONTree 
            data={cell.value} 
            shouldExpandNode={(keyName, data, level)=>{
                return false
            }}
            hideRoot={false} 
            theme={{
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