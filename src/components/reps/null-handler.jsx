import React from "react";

import { ObjectValue } from "react-inspector";

export default {
  shouldHandle: value => value === null,

  render: value => <ObjectValue object={value} />
};
