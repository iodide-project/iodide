import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";

// external styles
import "font-awesome/css/font-awesome.css";
import "opensans-npm-webfont/style.css";
import "codemirror/theme/eclipse.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "golden-layout/src/css/goldenlayout-base.css";
import "golden-layout/src/css/goldenlayout-light-theme.css";

// iodide styles
import "./shared/style/base";
import "./style/top-level-container-styles.css";
import "./style/side-panes.css";
import "./style/menu-and-button-and-ui-styles.css";
import "./style/codemirror-styles.css";
import "./style/help-modal-styles.css";
import "./style/golden-layout-style-overrides.css";

// theme settings
import "./style/client-style-defaults";

import NotebookHeader from "./components/menu/notebook-header";
import EditorPaneContainer from "./components/editor-pane-container";
import { store } from "./store";
import messagePasserEditor from "./redux-to-port-message-passer";
import handleInitialJsmd from "./handle-initial-jsmd";
import handleServerVariables from "./handle-server-variables";
import handleReportViewModeInitialization from "./handle-report-view-mode-initialization";
import { initializeDefaultKeybindings } from "./keybindings";

import { listenForEvalFramePortReady } from "./port-to-eval-frame";

import "./tools/initialize-codemirror-loadmode";
import "./tools/initialize-dom";
import evalQueue from "./actions/evaluation-queue";
import { checkNotebookConsistency } from "./actions/actions";
import CSSCascadeProvider from "./shared/css-cascade-provider";
import { subscribeToAutoSave } from "./tools/autosave";
import { checkForLocalAutoSave } from "./tools/local-autosave";

evalQueue.connectDispatch(store.dispatch);

initializeDefaultKeybindings();

window.addEventListener("message", listenForEvalFramePortReady, false);

handleServerVariables(store);
handleInitialJsmd(store);
handleReportViewModeInitialization(store);

// re-apply any locally saved changes if applicable
checkForLocalAutoSave(store);
// subscribe to an autosave handler for when the content of a
// document changes (both a local one which updates very frequently
// and a server-side one which updates slightly less frequently)
subscribeToAutoSave(store);

messagePasserEditor.connectDispatch(store.dispatch);
document.addEventListener(
  "visibilitychange",
  () => {
    console.log(`Visibility change! ${document.hidden}`);
    if (!document.hidden) {
      store.dispatch(checkNotebookConsistency());
    }
  },
  false
);

render(
  <Provider store={store}>
    <NotebookHeader />
  </Provider>,
  document.getElementById("notebook-header")
);

render(
  <CSSCascadeProvider>
    <Provider store={store}>
      <EditorPaneContainer />
    </Provider>
  </CSSCascadeProvider>,
  document.getElementById("editor-react-root")
);
