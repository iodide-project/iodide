import React, { Component } from 'react'
import PropTypes from 'prop-types'


class ErrorPane extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    errorInfo: PropTypes.object.isRequired,
  }
  render() {
    const { error, errorInfo } = this.props
    return (
      <div style={{
        zIndex: 100,
        margin: '150px',
      }}
      >
        <p>
          The kernel has encountered the following error:
          <br />
          <h1>{error.toString()}</h1>
          {errorInfo.componentStack}
          <br />
          <h3>
            Please file an <a href="https://github.com/iodide-project/iodide/issues">issue</a> and we will get right to fixing it.
            You can still save your changes to the editor.
          </h3>
        </p>
        <button>Save</button>
        <button>Reload</button>
      </div>
    )
  }
}

export default ErrorPane;

