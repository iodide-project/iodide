import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import actions from '../actions'
import { getCellById } from '../notebook-utils'
import { menuItems } from '../menu-content';

class CellContainer extends React.Component {
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

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={this.props.cellClass}
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
    pageMode: state.mode,
    viewMode: state.viewMode,
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
