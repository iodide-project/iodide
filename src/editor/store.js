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
if (process.env.NODE_ENV === "production") {
  finalReducer = reducer;
  enhancer = compose(applyMiddleware(thunk), applyMiddleware(sagaMiddleware));
} else if (
  process.env.NODE_ENV === "test" ||
  process.env.IODIDE_REDUX_LOG_MODE === "SILENT"
) {
  finalReducer = createValidatedReducer(reducer, stateSchema);
  enhancer = compose(applyMiddleware(thunk), applyMiddleware(sagaMiddleware));
} else if (process.env.IODIDE_REDUX_LOG_MODE === "VERY_VERBOSE") {
  finalReducer = createValidatedReducer(reducer, stateSchema);
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware),
    applyMiddleware(createLogger({ collapsed: () => true }))
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
            "UPDATE_IOMD_CONTENT",
            "UPDATE_MARKDOWN_CHUNKS",
            "UPDATE_CURSOR",
            "UPDATE_SELECTIONS"
          ].includes(action.type),
        collapsed: () => true
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
