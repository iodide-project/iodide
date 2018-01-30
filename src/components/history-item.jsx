import React, {createElement} from 'react'

import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'
import css from 'codemirror/mode/css/css'

import sublime from '../codemirror-keymap-sublime.js'

class HistoryItem extends React.Component {
  render() {
    let options = {
      lineNumbers: true,
      readOnly: true,
      mode: this.props.cell.cellType,
      theme: 'eclipse',
    }
    let mainElem = <CodeMirror ref='editor'
      value={this.props.cell.content}
      options={options} />

    return (
      <div id={'cell-' + this.props.cell.id}
        className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}>
        <div className='cell history-cell'>
          <div className='history-content'>{mainElem}</div>
          <div className='history-date'>{this.props.cell.lastRan.toUTCString()}</div>
        </div>
        <div className={'cell-controls'} />
      </div>
    )
  }
}



export {HistoryItem}