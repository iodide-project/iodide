import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellOutput from './output'
import CellEditor from './cell-editor'

import { getCellById } from '../notebook-utils'


export class PythonCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any,
    rendered: PropTypes.bool.isRequired,
  }

  static updateExecutionNumber = true

  evaluate(newState) {
    // add to newState.history
    newState.history.push({
      cellID: this.id,
      lastRan: new Date(),
      content: this.content,
    })

    this.value = undefined

    let output
    const code = this.content
    // commenting out the transpilation code for now, but don't delete -bcolloran
    // if (code.slice(0, 12) === '\'use matrix\'' || code.slice(0, 12) === '"use matrix"') {
    //   try {
    //     code = tjsm.transpile(this.content)
    //   } catch (e) {
    //     e.constructor(`transpilation failed: ${e.message}`)
    //   }
    // }
    output = Module.runPython(code)  // eslint-disable-line
    this.evalStatus = 'success'
    this.rendered = true
    if (output !== undefined) { this.value = output }
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor cellId={this.props.cellId} />
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
  }
}


export default connect(mapStateToProps)(PythonCellUnconnected)
