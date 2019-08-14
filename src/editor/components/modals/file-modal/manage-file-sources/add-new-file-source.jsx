import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";

import TextInput from "./text-input";
import DropdownSelector from "./dropdown-selector";
import { ContainedButton } from "../../../../../shared/components/buttons";

import { addFileSource as addFileSourceAction } from "../../../../actions/file-source-actions";
import {
  updateFileSourceInputFilename,
  updateFileSourceInputURL,
  updateFileSourceInputUpdateInterval,
  updateFileSourceInputStatusMessage,
  updateFileSourceInputStatusType
} from "../../../../actions/file-source-inputs-actions";

import { FILE_SOURCE_UPDATE_SELECTOR_OPTIONS } from "../../../../state-schemas/state-schema";

import { validateUrl, validateFilename } from "./validators";

const AddNewSourceContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto 120px;
  grid-column-gap: 20px;
  align-items: start;
`;

const AddNewSourceButtonContainer = styled.div`
  position: relative;
`;

const AddNewSourceButton = styled(ContainedButton)`
  justify-self: start;
  margin: 0;
`;

const FileSourceStatus = styled.div`
  min-height: 1em;
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FileSourceStatusText = styled.div`
  transform: translateY(${props => (props.isVisible ? "0" : "1.5em")});
  transition: 500ms;
  color: ${props => (props.statusType === "ERROR" ? "red" : "black")};
`;

export function AddNewFileSourceUnconnected({
  filename,
  url,
  statusMessage,
  statusType,
  updateInterval,
  updateFilename,
  updateURL,
  updateUpdateInterval,
  updateStatusMessage,
  updateStatusType,
  addFileSource
}) {
  const [statusVisible, updateStatusVisibility] = useState(false);
  const [status, updateStatus] = useState({ type: "NONE", text: "" });

  const urlIsValidForDisplay = validateUrl(url, true);
  const isValidFilenameForDisplay = validateFilename(filename, true);

  const handleUpdateIntervalChange = event => {
    updateUpdateInterval(event.target.value);
  };
  const submitInformation = async () => {
    updateStatusVisibility(true);
    updateStatus({ type: "LOADING", text: "adding file source ..." });

    if (url === "" || filename === "") {
      updateStatus({
        type: "ERROR",
        text: "must include source URL & desired filename"
      });
    } else if (!validateUrl(url)) {
      updateStatus({
        type: "ERROR",
        text: "source URL must include the protocol (e.g. https://)"
      });
    } else {
      let request;
      try {
        request = await addFileSource(url, filename, updateInterval);
      } catch (err) {
        updateStatus({
          type: "ERROR",
          text: err.message
        });
      }
      if (request) {
        updateStatus({ type: "SUCCESS", text: "added file source" });
        updateURL("");
        updateFilename("");
        updateUpdateInterval(FILE_SOURCE_UPDATE_SELECTOR_OPTIONS[0].key);
      }
    }
  };

  useEffect(() => {
    // clear status.type if not NONE after k seconds.
    if (statusVisible) {
      // change class?
      if (status.type === "SUCCESS" || status.type === "ERROR") {
        setTimeout(() => {
          updateStatusVisibility(false);
        }, 4000);
        // wait for bridge to be completed.
        setTimeout(() => {
          updateStatus({ type: "NONE" });
        }, 4500);
      }
    }
  });

  return (
    <>
      <AddNewSourceContainer>
        <AddNewSourceButtonContainer>
          <AddNewSourceButton onClick={submitInformation}>
            add file source
          </AddNewSourceButton>
        </AddNewSourceButtonContainer>
        <TextInput
          label="source URL"
          value={url}
          isValid={urlIsValidForDisplay}
          onKey={updateURL}
        />
        <TextInput
          label="desired filename"
          value={filename}
          isValid={isValidFilenameForDisplay}
          onKey={updateFilename}
        />
        <DropdownSelector
          value={updateInterval}
          options={FILE_SOURCE_UPDATE_SELECTOR_OPTIONS}
          onChange={handleUpdateIntervalChange}
          inputID="update-interval"
        />
      </AddNewSourceContainer>
      <FileSourceStatus
        className={`${status.type === "NONE" ? "hide" : "show"}`}
      >
        <FileSourceStatusText
          statusType={status.type}
          isVisible={statusVisible}
        >
          {status.text || "DEFAULT"}
        </FileSourceStatusText>
      </FileSourceStatus>
    </>
  );
}

AddNewFileSourceUnconnected.propTypes = {
  filename: PropTypes.string,
  url: PropTypes.string,
  statusMessage: PropTypes.string,
  statusType: PropTypes.string,
  updateInterval: PropTypes.string,
  addFileSource: PropTypes.func,
  updateFilename: PropTypes.func,
  updateURL: PropTypes.func,
  updateUpdateInterval: PropTypes.func,
  updateStatusMessage: PropTypes.func,
  updateStatusType: PropTypes.func
};

export function mapStateToProps(state) {
  const fileSourceInputs = Object.assign({}, state.fileSourceInputs);
  return {
    ...fileSourceInputs
  };
}

export default connect(
  mapStateToProps,
  {
    updateUpdateInterval: updateFileSourceInputUpdateInterval,
    updateURL: updateFileSourceInputURL,
    updateFilename: updateFileSourceInputFilename,
    addFileSource: addFileSourceAction,
    updateStatusMessage: updateFileSourceInputStatusMessage,
    updateStatusTYpe: updateFileSourceInputStatusType
  }
)(AddNewFileSourceUnconnected);
