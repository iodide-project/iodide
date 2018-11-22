import React, { Component } from 'react'
import PropTypes from 'prop-types'


class ErrorPane extends Component {
static propTypes = {
  error: PropTypes.string.isRequired,
  errorInfo: PropTypes.string.isRequired,
}
render() {
  const { error, errorInfo } = this.props
  return (
    <div>
      <p>
        The kernel has encountered the following error:
        {error}
        {errorInfo}
        Please file an [issue](https://github.com/iodide-project/iodide/issues) and we will get right to fixing it.
        You can still save your changes to the editor.
        [button: Save and Reload]
      </p>
    </div>
  )
}
}

export default ErrorPane;

