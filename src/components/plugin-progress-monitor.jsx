import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class PluginProgressMonitor extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  const cell = getCellById(state.cells, cellId)
  const codeMirrorName = (
    cell.cellType === 'code' ? state.languages[cell.language].codeMirrorName : cell.cellType
  )
  return {
    thisCellBeingEdited: cell.selected && state.mode === 'edit',
    viewMode: state.viewMode,
    cellType: cell.cellType,
    content: cell.content,
    cellId,
    codeMirrorName,
  }
}

export default connect(mapStateToProps)(PluginProgressMonitor)
