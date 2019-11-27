import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import TextInput from "./text-input";
import DropdownSelector from "./dropdown-selector";
import { ContainedButton } from "../../../../../shared/components/buttons";

import {
  updateFileSourceInputFilename,
  updateFileSourceInputURL,
  updateFileSourceInputUpdateInterval,
  updateFileSourceInputStatusMessage,
  updateFileSourceInputStatusType,
  updateFileSourceStatusVisibility,
  validateAndSubmitFileSourceInputs as validateAndSubmitFileSourceInputsAction,
  clearFileSourceInputUpdateStatus as clearFileSourceInputUpdateStatusAction
} from "../../../../actions/file-source-actions";

import { FILE_SOURCE_UPDATE_SELECTOR_OPTIONS } from "../../../../state-schemas/state-schema";

import { validateUrl, couldBeValidFilename } from "./validators";

// FIXME: there is a rendering bug on Firefox on SD screens + Linux
// where the border pixel calculations appear to get aliased. This is not
// a result of overflow issues nor of the component libraries we're using,
// but rather a result of how the modal resizes flexibly. This issue only
// seems to appear when the width / height are odd-valued pixels on non-retina
// displays, as far as I can tell.
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
  statusVisibilityClass,
  updateInterval,
  updateFilename,
  updateURL,
  updateUpdateInterval,
  statusIsVisible,
  isValidURLForDisplay,
  isValidFilenameForDisplay,
  validateAndSubmitFileSourceInputs,
  clearUpdateStatus
}) {
  const handleUpdateIntervalChange = event => {
    updateUpdateInterval(event.target.value);
  };

  // clears the update status if the resulting state
  // has it that statusIsVisible === true and statusType !== "NONE"
  // (that is, it is "SUCCESS" or "ERROR"), in which case it
  // cascades the redux store state changes around the animation
  useEffect(clearUpdateStatus);

  return (
    <>
      <AddNewSourceContainer>
        <AddNewSourceButtonContainer>
          <AddNewSourceButton
            onClick={() =>
              validateAndSubmitFileSourceInputs(url, filename, updateInterval)
            }
          >
            add file source
          </AddNewSourceButton>
        </AddNewSourceButtonContainer>
        <TextInput
          label="source URL"
          value={url}
          isValid={isValidURLForDisplay}
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
      <FileSourceStatus className={statusVisibilityClass}>
        <FileSourceStatusText
          statusType={statusType}
          isVisible={statusIsVisible}
        >
          {statusMessage}
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
  updateFilename: PropTypes.func,
  updateURL: PropTypes.func,
  statusVisibilityClass: PropTypes.string,
  updateUpdateInterval: PropTypes.func,
  statusIsVisible: PropTypes.bool,
  isValidURLForDisplay: PropTypes.bool,
  isValidFilenameForDisplay: PropTypes.bool,
  validateAndSubmitFileSourceInputs: PropTypes.func,
  clearUpdateStatus: PropTypes.func
};

export function mapStateToProps(state) {
  const { fileSources } = state;
  return {
    filename: fileSources.filename,
    url: fileSources.url,
    updateInterval: fileSources.updateInterval,
    statusMessage: fileSources.statusMessage,
    statusType: fileSources.statusType,
    statusVisibilityClass: fileSources.statusType === "NONE" ? "hide" : "show",
    statusIsVisible: fileSources.statusIsVisible,
    isValidURLForDisplay: validateUrl(fileSources.url, true),
    isValidFilenameForDisplay: couldBeValidFilename(fileSources.filename)
  };
}

export default connect(mapStateToProps, {
  updateUpdateInterval: updateFileSourceInputUpdateInterval,
  updateURL: updateFileSourceInputURL,
  updateFilename: updateFileSourceInputFilename,
  updateStatusMessage: updateFileSourceInputStatusMessage,
  updateStatusType: updateFileSourceInputStatusType,
  updateStatusVisibility: updateFileSourceStatusVisibility,
  validateAndSubmitFileSourceInputs: validateAndSubmitFileSourceInputsAction,
  clearUpdateStatus: clearFileSourceInputUpdateStatusAction
})(AddNewFileSourceUnconnected);
