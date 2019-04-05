import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import { allCases } from "../src/eval-frame/components/reps/__test_helpers__/reps-test-value-cases";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Button", module)
  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

const buttonStories2 = storiesOf("Button 23422", module);

for (let i = 0; i < 5; i++) {
  buttonStories2
    .add(`${i}  "with text"`, () => (
      <Button onClick={action("clicked")}>Hello Button {i}</Button>
    ))
    .add(`${i} "with some emoji"`, () => (
      <Button onClick={action("clicked")}>
        <span role="img" aria-label="so cool">
          😀 😎 👍 💯 {i}
        </span>
      </Button>
    ));
}

const tinyRepStories = storiesOf("tiny reps", module);

Object.entries(allCases).forEach(caseNameAndVal => {
  const [name, value] = caseNameAndVal;
  tinyRepStories.add(name, () => <span>{value.toString()}</span>);
});
