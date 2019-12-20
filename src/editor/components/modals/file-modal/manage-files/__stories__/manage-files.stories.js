import React from "react";

import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ManageFiles from "../manage-files";

const mockStore = configureStore([]);

const allTestCases = storiesOf("Files pane", module);

[true, false].forEach(userCanSave => {
  const testType = userCanSave ? "user can save" : "user can't save";

  allTestCases.add(`no files: ${testType}`, () => {
    const store = mockStore({
      notebookInfo: { user_can_save: userCanSave }
    });
    return (
      <Provider store={store}>
        <ManageFiles />
      </Provider>
    );
  });

  allTestCases.add(`one file: ${testType}`, () => {
    const store = mockStore({
      notebookInfo: {
        user_can_save: userCanSave,
        files: [{ filename: "foobar.jsx" }]
      }
    });
    return (
      <Provider store={store}>
        <ManageFiles />
      </Provider>
    );
  });
});
