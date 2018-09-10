import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import CellContainer from './cells/cell-container'
import FixedPositionContainer from './fixed-position-container'
import LayoutManager from './layout-manager'

class EditorPaneContainer extends React.Component {
  static propTypes = {
    cellsStyle: PropTypes.shape({
      padding: PropTypes.string.isRequired,
      overflow: PropTypes.string.isRequired,
      height: PropTypes.string.isRequired,
    }).isRequired,
    cellIds: PropTypes.array.isRequired,
    editorContainerZIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    const cellInputComponents = this.props.cellIds.map(id =>
      <CellContainer cellId={id} key={id} />)

    return (
      <div style={{
        width: '100%',
        flexGrow: 1,
        zIndex: this.props.editorContainerZIndex,
      }}
      >
        <LayoutManager />
        <FixedPositionContainer paneId="EditorPositioner">
          <div style={this.props.cellsStyle} id="cells">
            {cellInputComponents}
          </div>
        </FixedPositionContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const cellsStyle = {
    padding: '15px 15px 20px 15px',
    overflow: 'auto',
    height: '100%',
  }

  return {
    cellIds: state.cells.map(c => c.id),
    cellsStyle,
    editorContainerZIndex: state.viewMode === 'REPORT_VIEW' ? -10 : 'unset',
  }
}

export default connect(mapStateToProps)(EditorPaneContainer)
