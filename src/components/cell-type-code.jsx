import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellOutput from './output'
import CellEditor from './cell-editor'

import { getCellById } from '../notebook-utils'
import { getLanguageByName } from '../language'

export class CodeCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any,
    rendered: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow
          cellId={this.props.cellId}
          rowType="input"
          class={getLanguageByName(this.props.language).name}
        >
          <CellEditor cellId={this.props.cellId} language={this.props.language} />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="sideeffect">
          <div className="side-effect-target" />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <CellOutput
            valueToRender={this.props.value}
            render={this.props.rendered}
          />
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
    language: cell.language,
  }
}


export default connect(mapStateToProps)(CodeCellUnconnected)
