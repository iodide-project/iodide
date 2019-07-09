import React from "react";

import { ModalContainer } from "../modal-container";
import TitleBar from "../title-bar";
import ManageFiles from "./manage-files";

import OfflineFetcher from "../offline-fetcher/offline-fetcher";

export default () => (
  <ModalContainer tabIndex="-1">
    <TitleBar title="Manage Files" />
    <ManageFiles />
    <OfflineFetcher />
  </ModalContainer>
);
