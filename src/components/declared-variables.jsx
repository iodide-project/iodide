import React from 'react'
import PropTypes from 'prop-types'

import CellOutput from './output'

class DeclaredVariables extends React.Component {
  static propTypes = {
    variables: PropTypes.object,
  }
  render() {
    return (
      <div className="declared-variables">
        <CellOutput
          valueToRender={this.props.variables}
          render
        />
      </div>)
  }
}

export default DeclaredVariables
