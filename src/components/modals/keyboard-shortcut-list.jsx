import React from 'react'
import PropTypes from 'prop-types'

import KeyboardShortcutRep from './keyboard-shortcut-rep'

export default class KeyboardShortcutList extends React.Component {
  static propTypes = {
    helpModalOpen: PropTypes.bool,
    tasks: PropTypes.object,
  }

  render() {
    const globalKeys = []
    const commandModeKeys = []
    Object.keys(this.props.tasks)
      .filter(k => this.props.tasks[k].displayKeybinding)
      .forEach((k) => {
        const task = this.props.tasks[k]
        if (task.commandModeOnlyKey === true) {
          commandModeKeys.push(<KeyboardShortcutRep key={k} task={task} />)
        } else {
          globalKeys.push(<KeyboardShortcutRep key={k} task={task} />)
        }
      })

    return (
      <div className="help-modal-contents">
        <h2>Global keys</h2>
        <table className="keyboard-shortcuts-global"><tbody>{globalKeys}</tbody></table>
        <h2>Command mode keys (press <pre className="key-combo-pill">Esc</pre> to enter command mode)
        </h2>
        <table className="keyboard-shortcuts-command-mode"><tbody>{commandModeKeys}</tbody></table>
      </div>
    )
  }
}
