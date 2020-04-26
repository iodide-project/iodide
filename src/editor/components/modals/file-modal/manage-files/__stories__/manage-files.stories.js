import React from "react";

import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ManageFiles from "../manage-files";

const mockStore = configureStore([]);

const allTestCases = storiesOf("Files pane", module);

const baseNotebookInfo = {
  notebook_id: 1,
  user_can_save: true,
  max_file_size: 1024 * 1024
};

allTestCases.add("no files", () => {
  const store = mockStore({
    notebookInfo: {
      ...baseNotebookInfo,
      files: []
    }
  });
  return (
    <Provider store={store}>
      <ManageFiles />
    </Provider>
  );
});

allTestCases.add("one file", () => {
  const store = mockStore({
    notebookInfo: {
      ...baseNotebookInfo,
      files: [
        {
          filename: "example1.jpg",
          id: 215,
          lastUpdated: "2019-06-08T00:16:54.296040+00:00"
        }
      ]
    }
  });
  return (
    <Provider store={store}>
      <ManageFiles />
    </Provider>
  );
});
