import React from "react";

import { storiesOf } from "@storybook/react";

// import { createStore } from "redux";
// import { Provider } from "react-redux";

// import {ErrorStackRendererUnconnected} from "../error-stack-renderer"

import { ErrorStackRendererUnconnected } from "../error-stack-renderer";
import ConsoleMessage from "../../../console/history/components/console-message";

const errorStackItemStories = storiesOf("Error stacks", module);

// const state = {}

// const store = createStore(s => s, state);

// addDecorator(S => (
//   <Provider store={store}>
//     <S />
//   </Provider>
// ));

const goToTracebackItem = x => console.log(x);

const stack = {
  name: "SomeError",
  message: "a bad thing happened",
  stack: [
    {
      tracebackId: "traceback-1",
      functionName: "foo",
      traceDisplayName: "lodash.js",
      lineNumber: 3,
      columnNumber: 6,
      editedSinceEval: false,
      evalInUserCode: false,
      tracebackType: "FETCHED_JS_SCRIPT",
      goToTracebackItem,
      key: "1"
    },
    {
      tracebackId: "traceback-2",
      functionName: "bar",
      traceDisplayName: "[input-5-js]",
      lineNumber: 33,
      columnNumber: 46,
      editedSinceEval: false,
      evalInUserCode: false,
      tracebackType: "USER_EVALUATION",
      goToTracebackItem,
      key: "2"
    },
    {
      tracebackId: "traceback-3",
      functionName: "baradfd",
      traceDisplayName: "[input-3-js]",
      lineNumber: 21,
      columnNumber: 4,
      editedSinceEval: true,
      evalInUserCode: false,
      tracebackType: "USER_EVALUATION",
      goToTracebackItem,
      key: "3"
    },
    {
      tracebackId: "traceback-4",
      functionName: "",
      traceDisplayName: "[input-8-js]",
      lineNumber: 2,
      columnNumber: 14,
      editedSinceEval: true,
      evalInUserCode: true,
      tracebackType: "USER_EVALUATION",
      goToTracebackItem,
      key: "4"
    }
  ]
};

errorStackItemStories.add("tables", () => (
  <ConsoleMessage level="ERROR">
    <ErrorStackRendererUnconnected {...stack} />
  </ConsoleMessage>
));
