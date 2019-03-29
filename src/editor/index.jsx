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
import "../shared/style/base";
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
import messagePasserEditor from "../shared/utils/redux-to-port-message-passer";
import handleInitialJsmd from "./initialization/handle-initial-jsmd";
import handleServerVariables from "./initialization/handle-server-variables";
import handleReportViewModeInitialization from "./initialization/handle-report-view-mode-initialization";
import { initializeDefaultKeybindings } from "./initialization/keybindings";

import { listenForEvalFramePortReady } from "./port-to-eval-frame";

import "./initialization/initialize-codemirror-loadmode";
import "./initialization/initialize-dom";
import { checkNotebookConsistency } from "./actions/actions";
import { flushServerAutosave } from "./actions/server-actions";
import CSSCascadeProvider from "../shared/components/css-cascade-provider";
import { checkForLocalAutosave } from "./tools/local-autosave";

initializeDefaultKeybindings();

window.addEventListener("message", listenForEvalFramePortReady, false);

handleServerVariables(store);
handleInitialJsmd(store);
checkForLocalAutosave(store);
handleReportViewModeInitialization(store);

messagePasserEditor.connectDispatch(store.dispatch);

document.addEventListener(
  "visibilitychange",
  () => {
    if (!document.hidden) {
      // check notebook consistency if we are returning to this
      // tab or browser
      store.dispatch(checkNotebookConsistency());
    } else {
      // flush any pending server autosave if we're navigating
      // away (this will help ensure that a notebook shared
      // with others e.g. with a copypaste link will be up-to-date)
      flushServerAutosave();
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
