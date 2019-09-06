// import Mousetrap from "mousetrap";
// import tasks from "../user-tasks/task-definitions";

// Mousetrap.prototype.stopCallback = () => false;

// let warnUser = false;

// const preventBacknav = e => {
//   if (e.target === document.body) {
//     warnUser = true;
//   } else {
//     warnUser = false;
//   }
// };

// export function initializeDefaultKeybindings() {
//   Object.keys(tasks).forEach(t => {
//     const task = tasks[t];
//     if (task.hasKeybinding()) {
//       Mousetrap.bind(task.keybindings, task.keybindingCallback);
//     }
//   });
//   Mousetrap.bind(["delete", "backspace"], preventBacknav);
// }
