import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

// import CellContainer from './cells/cell-container'
import JsmdEditor from './jsmd-editor'
import FixedPositionContainer from './pane-layout/fixed-position-container'
import LayoutManager from './pane-layout/layout-manager'

class EditorPaneContainer extends React.Component {
  static propTypes = {
    cellsStyle: PropTypes.shape({
      padding: PropTypes.string.isRequired,
      overflow: PropTypes.string.isRequired,
      height: PropTypes.string.isRequired,
    }).isRequired,
    cellIds: PropTypes.array.isRequired,
    hideEditor: PropTypes.bool.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    // const cellInputComponents = this.props.cellIds.map(id =>
    //   <CellContainer cellId={id} key={id} />)

    return (
      <React.Fragment>
        <LayoutManager />
        <FixedPositionContainer
          paneId="EditorPositioner"
          hidden={this.props.hideEditor}
        >
          <JsmdEditor />
          {/* <div style={this.props.cellsStyle} id="cells">
            {cellInputComponents}
          </div> */}
        </FixedPositionContainer>
      </React.Fragment>
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
    hideEditor: state.viewMode === 'REPORT_VIEW',
  }
}

export default connect(mapStateToProps)(EditorPaneContainer)
