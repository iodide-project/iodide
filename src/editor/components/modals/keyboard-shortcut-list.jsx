import React from "react";

import KeyboardShortcutRep from "./keyboard-shortcut-rep";
import HelpModalContent from "./help-modal-content";

import tasks from "../../user-tasks/task-definitions";

export default class KeyboardShortcutList extends React.Component {
  render() {
    const globalKeys = [];
    Object.keys(tasks)
      .filter(k => tasks[k].displayKeybinding)
      .forEach(k => {
        const task = tasks[k];
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
