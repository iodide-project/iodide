import React from 'react'
import Tooltip from 'material-ui/Tooltip'

export const EditorButton = props => (
  <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={props.text}>
    <button
      className={`display-button ${props.isActive ? 'is-active' : ''} ${props.className || ''}`}
      style={props.style}
      onClick={props.onClick}
    >{props.children}
    </button>
  </Tooltip>)
