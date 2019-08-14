import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

import TextInput from "./text-input";
import { ContainedButton } from "../../../../../shared/components/buttons";

import { addFileSource as addFileSourceAction } from "../../../../actions/file-source-actions";
import {
  updateFileSourceInputFilename as updateFileSourceInputFilenameAction,
  updateFileSourceInputURL as updateFileSourceInputURLAction,
  updateFileSourceInputUpdateInterval as updateFileSourceInputUpdateIntervalAction
} from "../../../../actions/file-source-inputs-actions";
import { FILE_SOURCE_UPDATE_SELECTOR_OPTIONS } from "../../../../state-schemas/state-schema";

const AddNewSourceContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  align-items: start;
  grid-column-gap: 40px;
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

const ALLOWED_PROTOCOLS = ["https", "http"];

const hasAllowedProtocol = url => {
  return ALLOWED_PROTOCOLS.some(protocol => {
    return url.startsWith(protocol);
  });
};

export function AddNewFileSourceUnconnected({
  filename,
  url,
  updateInterval,
  updateFileSourceInputFilename,
  updateFileSourceInputURL,
  updateFileSourceInputUpdateInterval,
  addFileSource
}) {
  const [statusVisible, updateStatusVisibility] = useState(false);
  const [status, updateStatus] = useState({ type: "NONE", text: "" });

  const handleUpdateIntervalChange = event => {
    updateFileSourceInputUpdateInterval(event.target.value);
  };
  const submitInformation = async () => {
    updateStatusVisibility(true);
    updateStatus({ type: "LOADING", text: "adding file source ..." });

    if (url === "" || filename === "") {
      updateStatus({
        type: "ERROR",
        text: "must include source URL & desired filename"
      });
    } else if (!hasAllowedProtocol(url)) {
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
        updateFileSourceInputURL("");
        updateFileSourceInputFilename("");
        updateFileSourceInputUpdateInterval(
          FILE_SOURCE_UPDATE_SELECTOR_OPTIONS[0].key
        );
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
          onKey={updateFileSourceInputURL}
        />
        <TextInput
          label="desired filename"
          value={filename}
          onKey={updateFileSourceInputFilename}
        />
        <FormControl>
          <Select
            value={updateInterval}
            onChange={handleUpdateIntervalChange}
            inputProps={{
              name: "update-interval",
              id: "update-interval"
            }}
          >
            {FILE_SOURCE_UPDATE_SELECTOR_OPTIONS.map(opt => {
              return (
                <MenuItem key={opt.key} value={opt.key}>
                  {opt.label}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText htmlFor="update-interval">
            update frequency
          </FormHelperText>
        </FormControl>
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
  updateInterval: PropTypes.string,
  addFileSource: PropTypes.func,
  updateFileSourceInputFilename: PropTypes.func,
  updateFileSourceInputURL: PropTypes.func,
  updateFileSourceInputUpdateInterval: PropTypes.func
};

export function mapStateToProps(state) {
  return Object.assign({}, state.fileSourceInputs);
}

export default connect(
  mapStateToProps,
  {
    updateFileSourceInputUpdateInterval: updateFileSourceInputUpdateIntervalAction,
    updateFileSourceInputURL: updateFileSourceInputURLAction,
    updateFileSourceInputFilename: updateFileSourceInputFilenameAction,
    addFileSource: addFileSourceAction
  }
)(AddNewFileSourceUnconnected);
