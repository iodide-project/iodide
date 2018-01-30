import {GenericCell} from './cell.jsx'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


class MarkdownCell extends GenericCell {
  constructor(props) {
    super(props)
    this.editorOptions.lineWrapping = true
  }

  enterEditMode = () => {
    if (this.props.viewMode === 'editor') {
      if (this.props.pageMode !== 'edit') {
        this.props.actions.changeMode('edit')
      }
      this.props.actions.markCellNotRendered()
    }
  }

  inputComponent = () => {
    let editorDisplayStyle = (
      !this.props.cell.rendered ||
            (this.props.cell.selected &&
                this.props.pageMode == 'edit')
    ) ? 'block' : 'none'

    return (
      <CellEditor
        inputRef={this.editorElementRefCallback}
        cellId={this.props.cell.id}
        containerStyle={{display: editorDisplayStyle}}
        onContainerClick={this.enterEditMode}
        editorOptions = {{lineWrapping: true}}
      />
    )
  }

  outputComponent = () => {
    // the rendered MD is shown if this cell is NOT being edited
    // and if this.props.cell.rendered
    let resultDisplayStyle = ((
      this.props.cell.rendered &&
            !(this.props.cell.selected &&
                this.props.pageMode == 'edit')
    ) ? 'block' : 'none')
    return <div onDoubleClick={this.enterEditMode}
      style={{display: resultDisplayStyle}}
      dangerouslySetInnerHTML={{__html: this.props.cell.value}} />
  }
}







function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    cell: Object.assign({}, cell),
    id: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}
const connectedCell = connect(mapStateToPropsForCells, mapDispatchToProps)(MarkdownCell)
export {connectedCell as MarkdownCell}

