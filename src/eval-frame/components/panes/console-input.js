import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DoubleChevronIcon from './double-chevron-icon'

import { updateConsoleText, consoleHistoryStepBack } from '../../actions/actions'

export class ConsoleInputUnconnected extends React.Component {
  static propTypes = {
    consoleText: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef()
    this.containerRef = React.createRef()
    this.handleTextInput = this.handleTextInput.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.resizeToFitText = this.resizeToFitText.bind(this)
  }

  componentDidUpdate() {
    this.resizeToFitText()
  }

  resizeToFitText() {
    // snippet adapted from:
    // https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php
    this.textAreaRef.current.style.height = '';
    this.containerRef.current.style['min-height'] = `${this.textAreaRef.current.scrollHeight + 4}px`
    this.textAreaRef.current.style.height = '100%';
  }

  handleTextInput() {
    const textArea = this.textAreaRef.current
    this.resizeToFitText()
    this.props.updateConsoleText(textArea.value)
  }

  handleKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const textArea = this.textAreaRef.current
      const currentLine = textArea.value.substr(0, textArea.selectionStart).split('\n').length
      const totalLines = textArea.value.split('\n').length
      if (event.key === 'ArrowUp' && currentLine === 1) {
        this.props.consoleHistoryStepBack(1)
      }
      if (event.key === 'ArrowDown' && currentLine === totalLines) {
        this.props.consoleHistoryStepBack(-1)
      }
    }
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
            onInput={this.handleTextInput}
            onKeyDown={this.handleKeyDown}
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
            value={this.props.consoleText}
          />
        </div>
      </div>
    )
  }
}

export function mapStateToProps(state) {
  return {
    consoleText: state.consoleText,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateConsoleText: (consoleText) => {
      dispatch(updateConsoleText(consoleText))
    },
    consoleHistoryStepBack: (step) => {
      dispatch(consoleHistoryStepBack(step))
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ConsoleInputUnconnected)
