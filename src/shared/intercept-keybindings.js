import Mousetrap from "mousetrap";

Mousetrap.prototype.stopCallback = () => false;

let warnUser = false;

const preventBacknav = e => {
  warnUser = e.target === document.body;
};

export function handleInterceptBackspace() {
  console.log(warnUser);
  Mousetrap.bind(["delete", "backspace"], preventBacknav);
}

// window.onpopstate = e => {
//   console.log(e.state);
//   warnUser = true;
//   // eslint-disable-next-line no-alert
//   alert("event displatched");
//   window.dispatchEvent(new Event("beforeunlaod"));
// };

window.onbeforeunload = () => {
  // if (warnUser) {
  //   warnUser = false;
  //   return "Are you sure you want to leave?";
  // }
  return "Are you sure you want to leave?";
  // return undefined;
};
