import React from 'react'
import PropTypes from 'prop-types'
import UserTask from '../../actions/user-task'

export default class KeyboardShortcutRep extends React.Component {
  static propTypes = {
    task: PropTypes.instanceOf(UserTask),
  }

  render() {
    const { task: { displayKeybinding, title } } = this.props
    return (
      <tr>
        <td className="key-combo-column">
          <pre className="key-combo-pill">
            {displayKeybinding}
          </pre>
        </td>
        <td>{title}</td>
      </tr>
    )
  }
}
