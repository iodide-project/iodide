import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import configureStore from "redux-mock-store";

import ReportPane from "../report-pane";

const mockStore = configureStore([]);

describe("ReportPane", () => {
  [
    { name: "empty", reportChunks: [] },
    {
      name: "single markdown chunk",
      reportChunks: [
        { chunkId: "1", chunkType: "md", chunkContent: "*cheezburger*" }
      ]
    },
    {
      name: "single markdown chunk, css chunk",
      reportChunks: [
        { chunkId: "1", chunkType: "md", chunkContent: "*cheezburger*" },
        {
          chunkId: "2",
          chunkType: "css",
          chunkContent:
            "#htmlInMd {border: 2px solid gray; margin: 8px; padding: 4px;}"
        }
      ]
    },
    {
      name: "single markdown chunk, other kind of chunk",
      reportChunks: [
        { chunkId: "1", chunkType: "md", chunkContent: "*cheezburger*" },
        { chunkId: "2", chunkType: "mmd", chunkContent: "MERMAIDFTW" }
      ]
    }
  ].forEach(testCase => {
    test(`report pane: ${testCase.name}`, () => {
      const store = mockStore({
        reportChunks: testCase.reportChunks
      });

      const component = renderer.create(
        <Provider store={store}>
          <ReportPane />
        </Provider>
      );
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
