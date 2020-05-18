import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";

// external styles
import "font-awesome/css/font-awesome.css";
import "opensans-npm-webfont/style.css";
import "golden-layout/src/css/goldenlayout-base.css";
import "golden-layout/src/css/goldenlayout-light-theme.css";

// iodide styles
import "../shared/style/base";
import "./style/top-level-container-styles.css";
import "./style/side-panes.css";
import "./style/menu-and-button-and-ui-styles.css";
import "./style/help-modal-styles.css";
import "./style/golden-layout-style-overrides.css";
import "./style/eval-container.css";
import "./style/jupyter-rendered-html-styles.css";

// theme settings
import "./style/client-style-defaults";

import NotebookHeader from "./components/menu/notebook-header";
import EditorPaneContainer from "./components/editor-pane-container";
import { store } from "./store";
import messagePasserEditor from "../shared/utils/redux-to-port-message-passer";
import handleInitialIomd from "./initialization/handle-initial-iomd";
import handleServerVariables from "./initialization/handle-server-variables";
import handleReportViewModeInitialization from "./initialization/handle-report-view-mode-initialization";

import { listenForEvalFramePortReady } from "./port-to-eval-frame";

import { updateFiles } from "./actions/file-actions";
import { getFileSources } from "./actions/file-source-actions";

import { restoreLocalAutosave } from "./actions/local-autosave-actions";
import { checkLogin } from "./actions/server-session-actions";
import { handleEditorVisibilityChange } from "./actions/window-actions";
import CSSCascadeProvider from "../shared/components/css-cascade-provider";
import { initializeDefaultKeybindings } from "./initialization/keybindings";

initializeDefaultKeybindings();

window.addEventListener("message", listenForEvalFramePortReady, false);

handleServerVariables(store);
handleInitialIomd(store);
store.dispatch(restoreLocalAutosave());
store.dispatch(updateFiles());
store.dispatch(getFileSources());
store.dispatch(checkLogin());
handleReportViewModeInitialization(store);

messagePasserEditor.connectDispatch(store.dispatch);

document.addEventListener(
  "visibilitychange",
  () => store.dispatch(handleEditorVisibilityChange(document.hidden)),
  false
);

window.onbeforeunload = () => {
  // we want to warn the user before unload in two scenarios:
  // (1) the user has computed some unique state
  // (2) the user does not own the notebook and they have made local modifications
  const state = store.getState();
  if (
    state.sessionHasUserEvals ||
    (!state.notebookInfo.user_can_save && state.sessionHasUserEdits)
  ) {
    return "";
  }
  return undefined;
};

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
