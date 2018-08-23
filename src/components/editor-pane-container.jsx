import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'
import Resizable from 're-resizable'

import CellContainer from './cells/cell-container'

import * as actions from '../actions/actions'

class EditorPaneContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      changeEditorWidth: PropTypes.func.isRequired,
    }).isRequired,
    cellResizerDisplayStyle: PropTypes.string.isRequired,
    cellResizerWidth: PropTypes.number.isRequired,
    cellIds: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.onResizeStopHandler = this.onResizeStopHandler.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  onResizeStopHandler(e, direction, ref, d) {
    this.props.actions.changeEditorWidth(d.width)
  }

  render() {
    const cellInputComponents = this.props.cellIds.map(id =>
      <CellContainer cellId={id} key={id} />)
    // NB: #cells-resizer must wrap #cells in order for the resizer
    // drag bar to be *outside* of the scroll bar when there are enough
    // cells to require scrolling. #cells manages the scrolling
    return (
      <React.Fragment>
        <Resizable
          id="cells-resizer"
          enable={{
            bottom: false,
            top: false,
            right: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
            left: false,
          }}
          handleClasses={{ right: 'resizer' }}
          bounds="window"
          minWidth={300}
          onResizeStop={this.onResizeStopHandler}
          size={{ width: this.props.cellResizerWidth }}
          style={{
            display: this.props.cellResizerDisplayStyle,
            flexDirection: 'column',
          }}
        >
          <div id="cells">

            {cellInputComponents}
          </div>
        </Resizable>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    cellIds: state.cells.map(c => c.id),
    cellResizerWidth: state.editorWidth,
    cellResizerDisplayStyle: state.viewMode === 'REPORT_VIEW' ? 'none' : 'flex',
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditorPaneContainer)
