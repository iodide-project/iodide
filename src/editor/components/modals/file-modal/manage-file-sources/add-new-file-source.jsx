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
import { FILE_SOURCE_UPDATE_SELECTOR_OPTIONS } from "../../../../state-schemas/state-schema";

const AddNewSourceContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  align-items: start;
  grid-column-gap: calc(var(--marg) * 2);
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

export function addNewFileSourceUnconnected({ addFileSource }) {
  const [sourceState, updateSourceState] = useState("");
  const [filenameState, updateFilenameState] = useState("");
  const [statusVisible, updateStatusVisibility] = useState(false);
  const [status, updateStatus] = useState({ type: "NONE", text: "" });
  const [updateIntervalState, setUpdateIntervalState] = useState(
    FILE_SOURCE_UPDATE_SELECTOR_OPTIONS[0].key
  );

  const handleUpdateIntervalChange = event => {
    setUpdateIntervalState(event.target.value);
  };
  const submitInformation = async () => {
    updateStatusVisibility(true);
    updateStatus({ type: "LOADING", text: "adding file source ..." });

    if (sourceState === "" || filenameState === "") {
      updateStatus({
        type: "ERROR",
        text: "must include source URL & desired filename"
      });
    } else if (!hasAllowedProtocol(sourceState)) {
      updateStatus({
        type: "ERROR",
        text: "source URL must include the protocol (e.g. https://)"
      });
    } else {
      let request;
      try {
        request = await addFileSource(
          sourceState,
          filenameState,
          updateIntervalState
        );
      } catch (err) {
        updateStatus({
          type: "ERROR",
          text: err.message
        });
      }
      if (request) {
        updateStatus({ type: "SUCCESS", text: "added file source" });
        updateSourceState("");
        updateFilenameState("");
      }
    }
  };

  useEffect(() => {
    // clear status.type if not NONE after k seconds.
    if (statusVisible) {
      // change class?
      if (status.type !== "NONE") {
        setTimeout(() => {
          updateStatusVisibility(false);
        }, 4000);
        setTimeout(() => {
          updateStatus({ type: "NONE" });
        }, 4500);
      }
    }
  });

  return (
    <>
      <AddNewSourceContainer>
        <AddNewSourceButton onClick={submitInformation}>
          add file source
        </AddNewSourceButton>
        <TextInput
          label="Source URL"
          value={sourceState}
          onKey={updateSourceState}
        />
        <TextInput
          label="desired filename"
          value={filenameState}
          onKey={updateFilenameState}
        />
        <FormControl>
          <Select
            value={updateIntervalState}
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
            Update Interval
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

addNewFileSourceUnconnected.propTypes = {
  addFileSource: PropTypes.func
};

export default connect(
  undefined,
  { addFileSource: addFileSourceAction }
)(addNewFileSourceUnconnected);
