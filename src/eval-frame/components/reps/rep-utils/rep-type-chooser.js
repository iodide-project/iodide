import _ from "lodash";

const ROWS_TO_CHECK = 100;

// const arraysAreEqual = function (a1, a2) {
//     if (a1.length != a2.length) { return false }
//     for (let i = 0, l = a1.length; i < l; i++) {
//       if (a1[i] != a2[i]) { return false }
//     }
//     return true
//   }

const sameKeys = (x, y) => _.isEqual(_.sortBy(_.keys(x)), _.sortBy(_.keys(y)));

export function isRowDf(obj) {
  if (!_.isArray(obj) || obj.length < 2) {
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
