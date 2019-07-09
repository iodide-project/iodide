import React, { useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { ModalContainer } from "../modal-container";
import ManageFiles from "./manage-files";
import OfflineFetcher from "../offline-fetcher/offline-fetcher";
import THEME from "../../../../shared/theme";

export default () => {
  const [tab, setTab] = useState(0);
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
      {tab === 1 && <OfflineFetcher />}
    </ModalContainer>
  );
};
