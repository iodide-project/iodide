import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";

// external styles
import "font-awesome/css/font-awesome.css";
import "opensans-npm-webfont/style.css";
import "react-table/react-table.css";
import "../../node_modules/katex/dist/katex.min.css";

// iodide styles
import "./style/eval-container.css";
import "./style/side-panes.css";
import "./style/default-presentation.css";

import { initializeDefaultKeybindings } from "./keybindings";
import initializeUserVariables from "./initialize-user-variables";
import EvalContainer from "./components/eval-container";
import ViewModeStylesHandler from "./components/view-mode-styles-handler";
import { store } from "./store";
import messagePasser from "../redux-to-port-message-passer";

import { iodide } from "./iodide-api/api";

import "./port-to-editor";

messagePasser.connectDispatch(store.dispatch);
window.iodide = iodide;

initializeDefaultKeybindings();
// initialize variables available to the user in an empty notebook, such as
// the iodide API.
initializeUserVariables(store);

render(
  <Provider store={store}>
    <EvalContainer />
  </Provider>,
  document.getElementById("eval-container")
);

render(
  <Provider store={store}>
    <ViewModeStylesHandler />
  </Provider>,
  document.getElementById("view-mode-styles")
);
