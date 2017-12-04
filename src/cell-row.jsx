import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {getCellById} from "./notebook-utils.js"

import actions from './actions.jsx'

class CellRow extends React.Component {
    constructor(props) {
        super(props)
        // explicitly bind "this" for all methods in constructors
        this.handleCollapseButtonClick = this.handleCollapseButtonClick.bind(this)
    }

    handleCollapseButtonClick(){
        var nextCollapsedState;
        switch (this.props.collapsedState){
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
        this.props.actions.setCellCollapsedState(
            this.props.cellId,
            this.props.viewMode,
            this.props.rowType,
            nextCollapsedState)
    }

    componentDidUpdate(prevProps,prevState){
        // uncollapse the editor upon entering edit mode.
        // note: entering editMode is only allowed from editorView
        // thus, we only need to check the editorView collapsed state
        if (this.props.viewMode=="editor"
                && this.props.pageMode=="edit"
                && this.props.rowType=="input"
                && this.props.collapsedState=="COLLAPSED"){
            this.props.actions.setCellCollapsedState(
                this.props.cellId,
                this.props.viewMode,
                "input",
                "SCROLLABLE")
            }
    }

    render() {
        return (
            <div className={`cell-row ${this.props.rowType} ${this.props.collapsedState}`}>
                <div className ={"status"}>
                    {this.props.executionString}
                </div>
                <div className ={"collapse-button"}
                    onClick={this.handleCollapseButtonClick}>
                    {this.props.collapseButtonLabel}
                </div>
                <div className ={"main-component"}>
                    {this.props.mainComponent}
                </div>
            </div>
        )
    }
}

function mapStateToProps_CellRows(state,ownProps) {
    let cell = getCellById(state.cells, ownProps.cellId)
    let collapsedState
    switch (state.viewMode + "," + ownProps.rowType){
        case "presentation,input":
          collapsedState = cell.collapsePresentationViewInput
          break
        case "presentation,output":
          collapsedState = cell.collapsePresentationViewOutput
          break
        case "editor,input":
          collapsedState = cell.collapseEditViewInput
          break
        case "editor,output":
          collapsedState = cell.collapseEditViewOutput
          break
    }
    let executionString = (ownProps.rowType=="input") ? `[${cell.executionStatus}]` : ""
    // console.log("cellRow",cell)
    // console.log(collapsedState)
    var collapseButtonLabel;
    if (collapsedState=="COLLAPSED"){
        collapseButtonLabel = (ownProps.rowType=="input") ? cell.cellType : "output"
    } else {
        collapseButtonLabel = ""
    }
    return {
        pageMode: state.mode,
        viewMode: state.viewMode,
        cellType: cell.cellType,
        executionString: executionString,
        collapsedState: collapsedState,
        collapseButtonLabel: collapseButtonLabel
    }
}

function mapDispatchToProps_CellRows(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps_CellRows, mapDispatchToProps_CellRows)(CellRow)