import queryString from "query-string";

export function getUrlParams() {
  return queryString.parse(window.location.search);
}

export function objectToQueryString(obj) {
  return queryString.stringify(obj);
}

export function getStatePropsFromUrlParams() {
  const queryParams = getUrlParams();
  const report = queryParams.viewMode === "report";
  return { viewMode: report ? "REPORT_VIEW" : "EXPLORE_VIEW" };
}
