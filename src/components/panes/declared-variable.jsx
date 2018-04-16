import React from 'react'
import PropTypes from 'prop-types'

import { ValueRenderer } from '../reps/value-renderer'

export class DeclaredVariable extends React.Component {
  static propTypes = {
    varName: PropTypes.string,
  }
  render() {
    const r = true
    // console.log()
    // console.log()
    return (
      <div className="declared-variable">
        <div className="declared-variable-name">{this.props.varName} = </div>
        <div className="declared-variable-value">
          <ValueRenderer render={r} valueToRender={window[this.props.varName]} />
        </div>
      </div>)
  }
}
