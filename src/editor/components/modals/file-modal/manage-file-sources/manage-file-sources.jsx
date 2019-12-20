import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import AddNewFileSource from "./add-new-file-source";
import FileSourceList from "./file-source-list";

const FileSourceContainer = styled.div`
  /* this css variable is used in the children of FileSourceContainer */
  padding: 20px;
  overflow: auto;
`;

export class ManageFileSourcesUnconnected extends React.Component {
  static propTypes = {
    // Required
    readOnly: PropTypes.bool.isRequired
  };

  render = () => (
    <FileSourceContainer>
      {!this.props.readOnly && <AddNewFileSource />}
      <FileSourceList />
    </FileSourceContainer>
  );
}

export function mapStateToProps(state) {
  return {
    readOnly: !state.notebookInfo.user_can_save
  };
}

export default connect(mapStateToProps)(ManageFileSourcesUnconnected);
