import React from "react";
import PropTypes from "prop-types";

import KeyboardShortcutRep from "./keyboard-shortcut-rep";
import HelpModalContent from "./help-modal-content";

export default class KeyboardShortcutList extends React.Component {
  static propTypes = {
    helpModalOpen: PropTypes.bool,
    tasks: PropTypes.object
  };

  render() {
    const globalKeys = [];
    Object.keys(this.props.tasks)
      .filter(k => this.props.tasks[k].displayKeybinding)
      .forEach(k => {
        const task = this.props.tasks[k];
        globalKeys.push(<KeyboardShortcutRep key={k} task={task} />);
      });

    return (
      <HelpModalContent>
        <h2>Keyboard Shortcuts</h2>
        <table className="keyboard-shortcuts-global">
          <tbody>{globalKeys}</tbody>
        </table>
      </HelpModalContent>
    );
  }
}
