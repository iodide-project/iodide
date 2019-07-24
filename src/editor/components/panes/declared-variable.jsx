import React from "react";
import PropTypes from "prop-types";

import { ValueRendererUnwrapped } from "../../../reps/components/value-renderer";
import { wrapValueRenderer } from "../../../reps/components/rep-info-requestor";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";

export async function requestRepInfo(payload) {
  // return repInfoRequestResponse(payload);
  return messagePasserEditor.postMessageAndAwaitResponse(
    "REP_INFO_REQUEST",
    payload
  );
}

// import { requestRepInfo } from "./request-rep-info";

const requestTopLevelRepSummary = (rootObjName, pathToEntity) =>
  requestRepInfo({
    rootObjName,
    pathToEntity,
    requestType: "TOP_LEVEL_SUMMARY"
  });

const ValueRenderer = wrapValueRenderer(
  ValueRendererUnwrapped,
  requestTopLevelRepSummary
);

export class DeclaredVariable extends React.Component {
  static propTypes = {
    varName: PropTypes.string
  };
  render() {
    return (
      <div className="declared-variable">
        <div className="declared-variable-name">{this.props.varName} = </div>
        <div className="declared-variable-value">
          <ValueRenderer valueKey={this.props.varName} />
        </div>
      </div>
    );
  }
}
