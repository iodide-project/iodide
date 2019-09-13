import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import AddButton from "./add-button";
import NoFilesNotice from "./no-files-notice";
import FileList from "./file-list";
import Footer from "./footer";
import { fileShape } from "./propShapes";
import { defaultSpacing } from "./styles";

const bodyPadding = defaultSpacing;

// Padding is not scrollable in Firefox. Wrapping it fixes that.
// https://stackoverflow.com/a/29987556/4297741
const BodyWrapper = styled.div`
  display: grid;
  min-height: 250px;
  overflow: auto;
`;

const Body = styled.div`
  align-items: start;
  display: grid;
  grid-gap: ${defaultSpacing};
  grid-template-rows: min-content auto;
  padding: ${bodyPadding};
`;

export default class extends React.Component {
  static propTypes = {
    files: PropTypes.objectOf(PropTypes.shape(fileShape)).isRequired,
    onAddButtonClick: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired
  };

  hasVisibleFiles = () => {
    return (
      Object.values(this.props.files).filter(file => {
        return file.status !== "deleted";
      }).length > 0
    );
  };

  render = () => (
    <React.Fragment>
      <BodyWrapper>
        <Body>
          <AddButton onAddButtonClick={this.props.onAddButtonClick} />
          {this.hasVisibleFiles() ? (
            <React.Fragment>
              <FileList
                files={this.props.files}
                confirmDelete={this.props.confirmDelete}
              />
              <Footer />
            </React.Fragment>
          ) : (
            <NoFilesNotice />
          )}
        </Body>
      </BodyWrapper>
    </React.Fragment>
  );
}
