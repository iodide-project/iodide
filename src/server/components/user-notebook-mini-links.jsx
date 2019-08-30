import React from "react";
import PropTypes from "prop-types";
import { ListSmallLink } from "../../shared/components/list";

const MiniLink = ({ id }) => (
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
MiniLink.propTypes = {
  id: PropTypes.number
};
export default MiniLink;
