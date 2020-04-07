import React from "react";

import { storiesOf } from "@storybook/react";

import { ErrorStackRendererUnconnected } from "../error-stack-renderer";
import ConsoleMessage from "../../../console/history/components/console-message";

const errorStackStories = storiesOf("Error stacks", module);

const stack = {
  name: "SomeError",
  message: "a bad thing happened",
  stack: [1, 2, 3, 4]
};

errorStackStories.add("full error stack", () => (
  <ConsoleMessage level="ERROR">
    <ErrorStackRendererUnconnected {...stack} />
  </ConsoleMessage>
));
