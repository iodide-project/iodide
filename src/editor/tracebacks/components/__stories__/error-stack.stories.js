import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import { storiesOf } from "@storybook/react";

// import { createStore } from "redux";
// import { Provider } from "react-redux";

// import ErrorStackRenderer from "../error-stack-renderer";

import { ErrorStackRendererUnconnected } from "../error-stack-renderer";
import ConsoleMessage from "../../../console/history/components/console-message";

import CSSCascadeProvider from "../../../../shared/components/css-cascade-provider";

const store = {
  getState: () => {},
  subscribe: () => 0,
  dispatch: console.log
};

// eslint-disable-next-line react/prop-types
function Provider({ story }) {
  return (
    <CSSCascadeProvider>
      <ReduxProvider store={store}>{story}</ReduxProvider>
    </CSSCascadeProvider>
  );
}
const errorStackStories = storiesOf(
  "Error stack",
  module
).addDecorator(story => <Provider story={story()} />);

const onClickFn = console.log;

const stack = {
  name: "SomeError",
  message: "a bad thing happened",
  stack: [
    {
      functionName: "foo",
      traceDisplayName: "lodash.js",
      lineNumber: 3,
      columnNumber: 6,
      goToErrorType: "OPEN_SCRIPT",
      onClickFn,
      key: "1"
    },
    {
      functionName: "bar",
      traceDisplayName: "[input-5-js]",
      lineNumber: 33,
      columnNumber: 46,
      goToErrorType: "SHOW_IN_EDITOR",
      onClickFn,
      key: "2"
    },
    {
      functionName: "baradfd",
      traceDisplayName: "[input-3-js]",
      lineNumber: 21,
      columnNumber: 4,
      goToErrorType: "SHOW_IN_HISTORY",
      onClickFn,
      key: "3"
    },
    {
      functionName: "",
      traceDisplayName: "[input-8-js]",
      lineNumber: 2,
      columnNumber: 14,
      goToErrorType: "SHOW_IN_EDITOR",
      onClickFn,
      key: "4"
    }
  ]
};

errorStackStories.add("error stacks", () => (
  <ConsoleMessage level="ERROR">
    <ErrorStackRendererUnconnected {...stack} />
  </ConsoleMessage>
));
