import React from "react";

export default props => (
  <div className="no-history" key="history_empty">
    {props.children}
  </div>
);
