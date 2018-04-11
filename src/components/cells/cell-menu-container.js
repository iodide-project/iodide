import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'
import Menu from 'material-ui/Menu'

import CellMenu from './cell-menu'

import * as actions from '../../actions/actions'
import { getCellById } from '../../tools/notebook-utils'


export class CellMenuContainerUnconnected extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleIconButtonClose = this.handleIconButtonClose.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleIconButtonClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state
    return (
      <div className="cell-menu-container">
        <Tooltip
          classes={{ tooltip: 'iodide-tooltip' }}
          placement="bottom"
          title="Cell Settings"
          enterDelay={600}
        >
          <div
            className="cell-type-label"
            aria-label="more"
            aria-owns={anchorElement ? 'cell-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            {this.props.label}
            <Menu
              dense={false}
              id="cell-menu"
              anchorEl={this.state.anchorElement}
              open={Boolean(anchorElement)}
              onClose={this.handleIconButtonClose}
              // anchorReference="anchorPosition"
              anchorReference="anchorOrigin"
              transitionDuration={70}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              // anchorPosition={{ top: 50, left: 0 }}
            >
              <CellMenu menuLabel={this.props.label} />
            </Menu>
          </div>
        </Tooltip>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  const cell = getCellById(state.cells, cellId)
  let label
  if (cell.cellType === 'code') {
    label = cell.language
  } else if (cell.cellType === 'markdown') {
    label = 'md'
  } else if (cell.cellType === 'css') {
    label = 'css'
  } else if (cell.cellType === 'plugin') {
    label = 'plugin'
  } else if (cell.cellType === 'external dependencies') {
    label = 'resource'
  } else if (cell.cellType === 'raw') {
    label = 'raw'
  }
  return {
    label,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellMenuContainerUnconnected)
