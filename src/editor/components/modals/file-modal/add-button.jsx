import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

import { ContainedButton } from "../../../../shared/components/buttons";

const AddButton = styled(ContainedButton)`
  justify-self: start;
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default class extends React.Component {
  static propTypes = {
    onFileSelection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  /**
   * Click the hidden file <input>, which will cause the browser's file
   * selection dialog to appear.
   */
  openSelectDialog = () => {
    this.fileInputRef.current.click();
  };

  render = () => (
    <React.Fragment>
      <AddButton onClick={this.openSelectDialog}>Add files</AddButton>
      <HiddenInput
        type="file"
        onChange={this.props.onFileSelection}
        innerRef={this.fileInputRef}
        multiple
      />
    </React.Fragment>
  );
}
