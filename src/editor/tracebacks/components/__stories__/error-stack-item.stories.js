import { storiesOf } from "@storybook/react";
import StackItem from "../error-stack-item";

const errorStackStories = storiesOf("Error stacks/Stack items", module);

errorStackStories.add("All items in one list", () =>
  StackItem.getListOfStoryComponents()
);

const errorStackStoriesSingle = storiesOf(
  "Error stacks/Stack items/Individual items",
  module
);

StackItem.getListOfStoryComponents().forEach((Component, i) => {
  errorStackStoriesSingle.add(`item ${i}`, () => Component);
});
