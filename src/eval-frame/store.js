import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import reducer from "./reducers/reducer";
import { newNotebook } from "../editor/state-schemas/editor-state-prototypes";
import evalFrameStateSelector from "../editor/state-schemas/eval-frame-state-selector";

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else if (
  process.env.NODE_ENV === "test" ||
  process.env.IODIDE_REDUX_LOG_MODE === "SILENT"
) {
  enhancer = applyMiddleware(thunk);
} else {
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(
      createLogger({
        predicate: (getState, action) => action.type !== "REPLACE_STATE",
        colors: { title: () => "#27ae60" }
      })
    )
  );
}

const initialState = evalFrameStateSelector(newNotebook());

const store = createStore(reducer, initialState, enhancer);
const { getState } = store;
export { store, getState };
