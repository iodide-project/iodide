import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { getFileSources as getFileSourcesAction } from "../../../actions/file-source-actions";

import { ModalContainer } from "../modal-container";
import ManageFiles from "./manage-files/manage-files";
import ManageFileSources from "./manage-file-sources/manage-file-sources";
import THEME from "../../../../shared/theme";

const FileModalUnconnected = ({ getFileSources }) => {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    getFileSources();
  }, []);

  const changeTab = (evt, val) => setTab(val);
  return (
    <ModalContainer tabIndex="-1">
      <AppBar
        position="static"
        style={{
          background: THEME.clientModal.background
        }}
      >
        <Tabs value={tab} onChange={changeTab}>
          <Tab label="Manage Files" />
          <Tab label="Manage File Sources" />
        </Tabs>
      </AppBar>
      {tab === 0 && <ManageFiles />}
      {tab === 1 && <ManageFileSources />}
    </ModalContainer>
  );
};

FileModalUnconnected.propTypes = {
  getFileSources: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    getFileSources: () => {
      // run this every time we open the manage file sources tab specifically.
      dispatch(getFileSourcesAction());
    }
  };
}

export default connect(
  undefined,
  mapDispatchToProps
)(FileModalUnconnected);
