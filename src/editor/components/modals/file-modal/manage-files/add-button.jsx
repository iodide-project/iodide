import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import { ContainedButton } from "../../../../../shared/components/buttons";

const AddButton = styled(ContainedButton)`
  justify-self: start;
  margin: 0;
`;

export default class extends React.Component {
  static propTypes = {
    onAddButtonClick: PropTypes.func.isRequired
  };

  render = () => (
    <AddButton onClick={this.props.onAddButtonClick}>Add files</AddButton>
  );
}
