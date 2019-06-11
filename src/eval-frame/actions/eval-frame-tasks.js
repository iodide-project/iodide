import UserTask from "../../editor/user-tasks/user-task";

const tasks = {};

tasks.saveNotebook = new UserTask({
  title: "Save Notebook",
  keybindings: ["ctrl+s", "meta+s"],
  preventDefaultKeybinding: true,
  callback() {}
});

export default tasks;
