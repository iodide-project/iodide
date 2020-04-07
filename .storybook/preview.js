import React from "react";
import { addDecorator } from "@storybook/react";
import { Provider } from "react-redux";

import CSSCascadeProvider from "../src/shared/components/css-cascade-provider";

const store = {
  getState: () => {},
  subscribe: () => 0,
  dispatch: console.log
};

// eslint-disable-next-line react/prop-types
// addDecorator(storyFn => <Center>{storyFn()}</Center>);

addDecorator(story => {
  return (
    <CSSCascadeProvider>
      <Provider store={store}>{story()}</Provider>
    </CSSCascadeProvider>
  );
});
