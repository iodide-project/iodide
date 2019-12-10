import Mousetrap from "mousetrap";

Mousetrap.prototype.stopCallback = () => false;

let warnUser = false;

const preventBacknav = e => {
  warnUser = e.target === document.body;
};

export function handleInterceptBackspace() {
  Mousetrap.bind(["delete", "backspace"], preventBacknav);
}

window.onbeforeunload = () => {
  if (warnUser || window.history.pushState) {
    warnUser = false;
    return "Are you sure you want to leave?";
  }
  return undefined;
};
