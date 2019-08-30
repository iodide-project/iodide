import UserTask from "./user-task";
import ExternalLinkTask from "./external-link-task";
import { store } from "../store";
import {
  moveCursorToNextChunk,
  toggleWrapInEditors
} from "../actions/editor-actions";
import { evaluateText, evaluateNotebook } from "../actions/eval-actions";
import {
  toggleFileModal,
  toggleHelpModal,
  toggleHistoryModal
} from "../actions/modal-actions";
import { clearVariables } from "../actions/notebook-actions";

// FIXME: remove requirement to import store in this file by attaching
// keypress handling to store in initializeDefaultKeybindings() --
// and change that to initializeDefaultKeybindings(dispatch).
// Callback should map to a standard action creator that can be passed
// to dispatch.

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
    store.dispatch(moveCursorToNextChunk());
  }
});

tasks.toggleWrapInEditors = new UserTask({
  title: "Toggle wrapping in editors",
  displayKeybinding: "Alt+w", // '\u2193',
  keybindings: ["alt+w"],
  preventDefaultKeybinding: true,
  callback() {
    store.dispatch(toggleWrapInEditors());
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
    store.dispatch(clearVariables());
  }
});

tasks.toggleFileModal = new UserTask({
  title: "Manage Files",
  callback() {
    store.dispatch(toggleFileModal());
  }
});

tasks.toggleHistoryModal = new UserTask({
  title: "View Notebook History",
  menuTitle: "History",
  callback() {
    store.dispatch(toggleHistoryModal());
  }
});

tasks.toggleHelpModal = new UserTask({
  title: "Open the Help Pane",
  menuTitle: "Help",
  keybindings: ["alt+h"],
  displayKeybinding: "Alt+h",
  preventDefaultKeybinding: true,
  callback() {
    store.dispatch(toggleHelpModal());
  }
});

export default tasks;
