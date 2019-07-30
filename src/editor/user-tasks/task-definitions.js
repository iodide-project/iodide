import UserTask from "./user-task";
import ExternalLinkTask from "./external-link-task";
import { store } from "../store";
import * as actions from "../actions/actions";
import { evaluateText, evaluateNotebook } from "../actions/eval-actions";

// FIXME: remove requirement to import store in this file by attaching
// keypress handling to store in initializeDefaultKeybindings() --
// and change that to initializeDefaultKeybindings(dispatch).
// Callback should map to a standard action creator that can be passed
// to dispatch.

const dispatcher = {};
for (const action in actions) {
  if (Object.prototype.hasOwnProperty.call(actions, action)) {
    dispatcher[action] = (...params) =>
      store.dispatch(actions[action](...params));
  }
}

const oscpu = window.navigator.oscpu || window.navigator.platform;
let OSName = "Unknown OS";
if (oscpu.indexOf("Win") !== -1) OSName = "Windows";
if (oscpu.indexOf("Mac") !== -1) OSName = "MacOS";
if (oscpu.indexOf("X11") !== -1) OSName = "UNIX";
if (oscpu.indexOf("Linux") !== -1) OSName = "Linux";

const commandKey = OSName === "MacOS" ? "⌘" : "Ctrl";

const tasks = {};

tasks.evaluateChunk = new UserTask({
  title: "Run Code Chunk",
  keybindings: ["mod+enter"],
  displayKeybinding: `${commandKey}+Enter`,
  callback() {
    store.dispatch(evaluateText());
  }
});

tasks.evaluateNotebook = new UserTask({
  title: "Run Full Notebook",
  menuTitle: "Run Full Notebook",
  callback() {
    store.dispatch(evaluateNotebook());
  }
});

tasks.evaluateChunkAndSelectBelow = new UserTask({
  title: "Evaluate Code Chunk and Select Below",
  keybindings: ["shift+enter"],
  displayKeybinding: "Shift+Enter",
  preventDefaultKeybinding: true,
  callback() {
    store.dispatch(evaluateText());
    dispatcher.moveCursorToNextChunk();
  }
});

tasks.toggleWrapInEditors = new UserTask({
  title: "Toggle wrapping in editors",
  displayKeybinding: "Alt+w", // '\u2193',
  keybindings: ["alt+w"],
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.toggleWrapInEditors();
  }
});

tasks.newNotebook = new ExternalLinkTask({
  title: "New Notebook",
  url: "/new"
});

// this overrides the browser default's ctrl+s but otherwise does nothing.
// displayKeybinding not needed
tasks.saveNotebook = new UserTask({
  title: "Save Notebook",
  keybindings: ["ctrl+s", "meta+s"],
  preventDefaultKeybinding: true,
  callback() {}
});

tasks.clearVariables = new UserTask({
  title: "Clear Variables",
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.clearVariables();
  }
});

tasks.toggleFileModal = new UserTask({
  title: "Manage Files",
  callback() {
    dispatcher.toggleFileModal();
  }
});

tasks.toggleHistoryModal = new UserTask({
  title: "View Notebook History",
  menuTitle: "History",
  callback() {
    dispatcher.toggleHistoryModal();
  }
});

tasks.toggleHelpModal = new UserTask({
  title: "Open the Help Pane",
  menuTitle: "Help",
  keybindings: ["alt+h"],
  displayKeybinding: "Alt+h",
  preventDefaultKeybinding: true,
  callback() {
    dispatcher.toggleHelpModal();
  }
});

tasks.fileAnIssue = new ExternalLinkTask({
  title: "File an Issue",
  menuTitle: "File an Issue ...",
  url: "http://github.com/iodide-project/iodide/issues/new"
});

tasks.seeAllExamples = new ExternalLinkTask({
  title: "See All Examples",
  menuTitle: "See All Examples ...",
  url: "http://github.com/iodide-project/iodide-examples/"
});

export default tasks;
