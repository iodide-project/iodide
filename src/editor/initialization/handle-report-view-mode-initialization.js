import { evaluateNotebook } from "../actions/eval-actions";
import { setViewMode } from "../actions/notebook-actions";

import { getStatePropsFromUrlParams } from "../tools/query-param-tools";

export default function handleReportViewModeInitialization(store) {
  const otherParams = getStatePropsFromUrlParams();
  if (otherParams.viewMode === "REPORT_VIEW") {
    store.dispatch(setViewMode(otherParams.viewMode));
    store.dispatch(evaluateNotebook());
  }
}
