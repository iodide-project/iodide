import React, { useEffect } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import FileSourceListItem from "./file-source-list-item";

import { List } from "../../../../../shared/components/list";

import {
  deleteFileSource as deleteFileSourceAction,
  getFileSources as getFileSourcesAction
} from "../../../../actions/file-source-actions";

// FIXME: make sure this applies to 'manage files' as well.

const FileSourceListContainer = styled.div`
  width: 100%;
  margin: auto;
`;

const NoFileSourcesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
`;

const FileSourceListUnconnected = ({ fileSources = [], getFileSources }) => {
  // we will handle the delete modal state in a hook.
  // otherwise, the state for the file sources is managed in the
  // store itself.

  useEffect(() => {
    getFileSources();
  }, []);

  return fileSources.length ? (
    <FileSourceListContainer>
      <List>
        {fileSources.map(({ id }) => {
          return <FileSourceListItem key={id} id={id} />;
        })}
      </List>
    </FileSourceListContainer>
  ) : (
    <NoFileSourcesNotice>
      No file sources are associated with this notebook
    </NoFileSourcesNotice>
  );
};

FileSourceListUnconnected.propTypes = {
  fileSources: PropTypes.arrayOf(PropTypes.object),
  getFileSources: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    fileSources: state.fileSources.sources.map(({ id }) => {
      return {
        id
      };
    })
  };
}

export default connect(
  mapStateToProps,
  {
    deleteFileSource: deleteFileSourceAction,
    getFileSources: getFileSourcesAction
  }
)(FileSourceListUnconnected);
