import _ from "lodash";

const ROWS_TO_CHECK = 100;

function sameKeys(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  aKeys.sort();
  bKeys.sort();

  for (let i = 0; i < aKeys.length; ++i) {
    if (aKeys[i] !== bKeys[i]) return false;
  }
  return true;
}

export function isRowDf(obj) {
  if (!_.isArray(obj) || obj.length < 2 || !_.isPlainObject(obj[0])) {
    return false;
  }
  const rowsToCheck = Math.min(ROWS_TO_CHECK, _.size(obj));
  for (let i = 1; i < rowsToCheck; i++) {
    if (!_.isPlainObject(obj[i])) {
      return false;
    }
    if (!sameKeys(obj[0], obj[i])) {
      return false;
    }
  }
  return true;
}
