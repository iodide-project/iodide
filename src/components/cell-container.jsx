import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import PropTypes from 'prop-types';

import actions from '../actions'
import { getCellById } from '../notebook-utils'
import { menuItems } from '../menu-content';

class CellContainer extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    // cellClass: PropTypes.string,
    children: PropTypes.node,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleCellClick = () => {
    if (this.props.viewMode === 'editor') {
      const scrollToCell = false
      if (!this.props.selected) {
        this.props.actions.selectCell(this.props.cellId, scrollToCell)
      }
    }
  }

  render() {
    const cellTypes = menuItems.cell.types.map((type, index) => (
      <MenuItem
        value={index}
        primaryText={type.primaryText}
        onClick={(e) => {
          e.preventDefault();
          type.callback.call(this);
        }}
        key={`cell-${this.props.cellId}-${type.primaryText}`}
      />));
    const cellClass = `cell-container ${
      this.props.cellType
    } ${
      this.props.cellClass
    } ${
      this.props.selected ? 'selected-cell' : ''
    } ${
      (this.props.selected && this.props.pageMode === 'edit') ?
        'edit-mode ' : 'command-mode '
    }`

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={cellClass}
        onMouseDown={this.handleCellClick}
      >
        {this.props.children}
        <div className="cell-type-container">
          <MuiThemeProvider>
            <SelectField
              value={menuItems.cell.types.findIndex(type => type.primaryText.toLowerCase() === this.props.cellType.toLowerCase())}
              children={cellTypes}
              className="type-select"
            />
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    cellType: cell.cellType,
    selected: cell.selected,
    pageMode: state.mode,
    viewMode: state.viewMode,
    cellType: cell.cellType,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Page)
const CellContainerConnected = connect(mapStateToProps, mapDispatchToProps)(CellContainer)
export { CellContainerConnected as CellContainer }
