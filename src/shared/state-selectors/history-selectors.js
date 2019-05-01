import { createSelectorCreator, defaultMemoize } from "reselect";

const areArraysShallowEqual = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const createShallowEqualArraySelector = createSelectorCreator(
  defaultMemoize,
  areArraysShallowEqual
);

const getHistoryIds = state => state.history.map(h => h.historyId);

export const getHistoryIdsForConsole = createShallowEqualArraySelector(
  getHistoryIds, // if this returns the same list...
  historyIdArray => historyIdArray // ...return the same array
);

export const getHistoryItemById = (state, historyId) =>
  state.history.filter(h => h.historyId === historyId)[0];
