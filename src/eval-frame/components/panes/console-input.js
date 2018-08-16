import React from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import deepEqual from 'deep-equal'
import DoubleChevronIcon from './double-chevron-icon'


export default class ConsoleInput extends React.Component {
  // static propTypes = {
  //   history: PropTypes.array,
  // }

  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef()
    this.containerRef = React.createRef()
    this.inputHeightAdjustFn = this.inputHeightAdjustFn.bind(this)
  }

  inputHeightAdjustFn() {
    // snippet adapted from:
    // https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php
    this.textAreaRef.current.style.height = '';
    this.containerRef.current.style['min-height'] = `${this.textAreaRef.current.scrollHeight + 4}px`
    this.textAreaRef.current.style.height = '100%';
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className="console-text-input-container"
        style={{
          borderTop: '1px solid #ddd',
          display: 'flex',
        }}
      >
        <DoubleChevronIcon />
        <div style={{ flexGrow: 1 }}>
          <textarea
            name="text"
            ref={this.textAreaRef}
            onInput={this.inputHeightAdjustFn}
            rows="1"
            style={{
              resize: 'none',
              lineHeight: '20px',
              padding: '3px 0px 0px 0px',
              height: '100%',
              width: '100%',
              border: 'none',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </div>
    )
  }
}

// export function mapStateToProps(state) {
//   return {
//     sidePaneMode: state.sidePaneMode,
//     history: state.history,
//     paneDisplay: state.sidePaneMode === '_CONSOLE' ? 'block' : 'none',
//   }
// }

// export default connect(mapStateToProps)(HistoryPaneUnconnected)
