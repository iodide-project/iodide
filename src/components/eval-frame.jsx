import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class EvalFrameUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.array,
  }

  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    this.storeFrameElementRef = this.storeFrameElementRef.bind(this)
  }

  componentDidMount() {
    // this.iframe.onload = () => {
    //   this.iframe.contentWindow.postMessage('hello', '*');
    // }
  }

  shouldComponentUpdate() {
    return false;
  }

  storeFrameElementRef(iframe) {
    this.iframe = iframe
    window.IODIDE_EVAL_FRAME = iframe
  }

  render() {
    return (
      <iframe
        src="iodide.eval-frame.dev.html"
        width="100%"
        height="100%"
        title="eval-frame"
        sandbox="allow-scripts"
        ref={this.storeFrameElementRef}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    appMessages: state.appMessages,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(EvalFrameUnconnected)
