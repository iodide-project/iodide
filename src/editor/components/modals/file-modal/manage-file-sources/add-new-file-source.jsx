import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";

import TextInput from "./text-input";
import { ContainedButton } from "../../../../../shared/components/buttons";

import { addFileSource } from "../../../../actions/file-source-actions";

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

const UpdateIntervalSelector = styled.select`
  display: block;
  font-weight: 700;
  color: #444;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  border-radius: 0.5em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;

  ::-ms-expand {
    display: none;
  }
  :hover {
    border-color: #888;
  }
  :focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  }
  option {
    font-weight: normal;
  }
`;

const ALLOWED_PROTOCOLS = ["https", "http"];
const UPDATE_INTERVAL_OPTIONS = ["never", "daily", "weekly"];

const hasAllowedProtocol = url => {
  return ALLOWED_PROTOCOLS.some(protocol => {
    return url.startsWith(protocol);
  });
};

export function addNewFileSourceUnconnected({ addNewFileSource }) {
  const [sourceState, updateSourceState] = useState("");
  const [filenameState, updateFilenameState] = useState("");
  const [statusVisible, updateStatusVisibility] = useState(false);
  const [status, updateStatus] = useState({ type: "NONE", text: "" });
  const [updateIntervalState, setUpdateIntervalState] = useState(
    UPDATE_INTERVAL_OPTIONS[0]
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
        request = await addNewFileSource(
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
        <div>
          <UpdateIntervalSelector
            value={updateIntervalState}
            onChange={handleUpdateIntervalChange}
          >
            {UPDATE_INTERVAL_OPTIONS.map(value => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </UpdateIntervalSelector>
          update interval
        </div>
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
  addNewFileSource: PropTypes.func
};

function mapStateToProps(state) {
  return {
    filesSources: state.notebookInfo.filesSources
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNewFileSource: async (
      sourceURL,
      destinationFilename,
      updateInterval
    ) => {
      return dispatch(
        addFileSource(sourceURL, destinationFilename, updateInterval)
      );
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addNewFileSourceUnconnected);
