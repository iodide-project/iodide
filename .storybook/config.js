import { configure, addParameters } from "@storybook/react";
import requireContext from 'require-context.macro';

addParameters({
  options: {
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showPanel: false
  }
});

// automatically import all files ending in *.stories.js
const req = requireContext("../src", true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
