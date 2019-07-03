import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "react-emotion";

import TextInput from "./text-input";
import { ContainedButton } from "../../../../shared/components/buttons";

import { addFileSource } from "../../../actions/file-source-actions";

const AddNewSourceContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  align-items: start;
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

export function addNewFileSourceUnconnected({ addNewFileSource }) {
  const [sourceState, updateSourceState] = useState("");
  const [filenameState, updateFilenameState] = useState("");
  const [statusVisible, updateStatusVisibility] = useState(false);
  const [status, updateStatus] = useState({ type: "NONE", text: "" });

  const submitInformation = () => {
    updateStatus({ type: "NONE" });
    if (sourceState === "" || filenameState === "") {
      updateStatus({
        type: "ERROR",
        text: "must include source URL & desired filename"
      });
    } else {
      updateStatus({ type: "SUCCESS", text: "added file source" });
      addNewFileSource(sourceState, filenameState, "never");
      updateSourceState("");
      updateFilenameState("");
    }
    updateStatusVisibility(true);
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
    addNewFileSource: (sourceURL, destinationFilename, frequency) => {
      dispatch(addFileSource(sourceURL, destinationFilename, frequency));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addNewFileSourceUnconnected);
