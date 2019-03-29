/* global IODIDE_BUILD_MODE IODIDE_REDUX_LOG_MODE */
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import createValidatedReducer from "./reducers/create-validated-reducer";
import reducer from "./reducers/reducer";
import {
  newNotebook,
  stateSchema
} from "./state-schemas/editor-state-prototypes";
import { getUserDataFromDocument } from "./tools/server-tools";

import rootSaga from "./actions/sagas/root-saga";

let enhancer;
let finalReducer;

const sagaMiddleware = createSagaMiddleware();

if (IODIDE_BUILD_MODE === "production") {
  finalReducer = reducer;
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware)
  );
} else if (IODIDE_BUILD_MODE === "test" || IODIDE_REDUX_LOG_MODE === "SILENT") {
  finalReducer = createValidatedReducer(reducer, stateSchema);
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware)
  );
} else {
  finalReducer = createValidatedReducer(reducer, stateSchema);
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware),
    applyMiddleware(
      createLogger({
        predicate: (getState, action) =>
          ![
            "UPDATE_JSMD_CONTENT",
            "UPDATE_MARKDOWN_CHUNKS",
            "UPDATE_CURSOR",
            "UPDATE_SELECTIONS"
          ].includes(action.type)
      })
    )
  );
}
const store = createStore(
  finalReducer,
  Object.assign(newNotebook(), getUserDataFromDocument()),
  enhancer
);

sagaMiddleware.run(rootSaga);

const { dispatch } = store;
export { store, dispatch };
