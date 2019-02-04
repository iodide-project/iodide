import React from "react";

import { ObjectValue } from "iodide-react-inspector";

export default {
  shouldHandle: value => value === null,

  render: value => <ObjectValue object={value} />
};
