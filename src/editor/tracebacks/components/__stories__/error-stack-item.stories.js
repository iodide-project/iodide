import React from "react";

import { storiesOf } from "@storybook/react";

import { Provider as ReduxProvider } from "react-redux";

import StackItem, { StackItemUnconnected } from "../error-stack-item";
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
  "Error stack items",
  module
).addDecorator(story => <Provider story={story()} />);

errorStackStories.add(
  "error stack items",
  () =>
    // <ConsoleMessage level="ERROR">
    StackItemUnconnected.storyPropsList.map(() => <StackItem />)
  // {/* </ConsoleMessage> */}
);
