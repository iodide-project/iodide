import { all } from "redux-saga/effects";

import { evaluateCurrentQueue } from "./eval-queue-saga";

export default function* rootSaga() {
  yield all([evaluateCurrentQueue()]);
}
