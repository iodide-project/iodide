import UserTask from "./user-task";
// is this the right way to compose?
export default class VisitExternalLink {
  constructor(args) {
    const combinedArgs = Object.assign(args, {
      callback() {
        window.open(args.url, "_blank");
      }
    });
    this.userTask = new UserTask(combinedArgs);
  }

  get title() {
    return this.userTask.title;
  }

  get menuTitle() {
    return this.userTask.menuTitle;
  }

  get callback() {
    return this.userTask.callback;
  }

  get keybindingCallack() {
    return this.userTask.keybindingCallback;
  }

  hasKeybinding() {
    return this.userTask.hasKeybinding();
  }
}
