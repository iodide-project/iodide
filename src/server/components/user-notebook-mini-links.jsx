import React from "react";
import { ListSmallLink } from "./list";

export default ({ id }) => (
  <React.Fragment>
    <ListSmallLink href={`/notebooks/${id}/`}>explore</ListSmallLink>
    <ListSmallLink href={`/notebooks/${id}/?viewMode=report`}>
      report
    </ListSmallLink>
    <ListSmallLink href={`/notebooks/${id}/revisions/`}>
      revisions
    </ListSmallLink>
  </React.Fragment>
);
