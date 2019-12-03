import initStoryshots from "@storybook/addon-storyshots";

// excluding reps tests for now, as they include stack info
// which is non-deterministic
initStoryshots({
  storyKindRegex: /^((?!.*?reps test cases).)*$/
});
