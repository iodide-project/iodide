import React from "react";
import PropTypes from "prop-types";
import UserTask from "../../user-tasks/user-task";

export default class KeyboardShortcutRep extends React.Component {
  static propTypes = {
    task: PropTypes.instanceOf(UserTask)
  };

  render() {
    return (
      <tr>
        <td className="key-combo-column">
          <pre className="key-combo-pill">
            {this.props.task.displayKeybinding}
          </pre>
        </td>
        <td>{this.props.task.title}</td>
      </tr>
    );
  }
}
