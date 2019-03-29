import UserTask from "../../editor/user-tasks/user-task";
import { postKeypressToEditor } from "../port-to-editor";

const tasks = {};

tasks.saveNotebook = new UserTask({
  title: "Save Notebook",
  keybindings: ["ctrl+s", "meta+s"],
  preventDefaultKeybinding: true,
  callback() {}
});

tasks.exportNotebook = new UserTask({
  title: "Export Notebook",
  keybindings: ["ctrl+shift+e", "meta+shift+e"],
  callback() {
    postKeypressToEditor(this.keybindings[0]);
  }
});

export default tasks;
