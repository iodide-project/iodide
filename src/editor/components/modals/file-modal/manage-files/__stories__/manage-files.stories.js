import React from "react";

import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ManageFiles from "../manage-files";

const mockStore = configureStore([]);

const allTestCases = storiesOf("Files pane", module);

allTestCases.add("no files", () => {
  const store = mockStore({ notebookInfo: {} });
  return (
    <Provider store={store}>
      <ManageFiles />
    </Provider>
  );
});

allTestCases.add("one file", () => {
  const store = mockStore({
    notebookInfo: { files: [{ filename: "foobar.jsx" }] }
  });
  return (
    <Provider store={store}>
      <ManageFiles />
    </Provider>
  );
});
