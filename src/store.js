import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'

import createValidatedReducer from './create-validated-reducer'
import reducer from './reducers/reducer'
import { initializeNotebook } from './initialize-notebook'
import { stateSchema } from './state-prototypes'
import evaluateAllCells from './evaluate-all-cells'

const initialState = initializeNotebook()

const store = createStore(
  createValidatedReducer(reducer, stateSchema),
  // reducer,
  initialState,
  compose(applyMiddleware(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT',
  }))),
)

if (initialState.viewMode === 'presentation') { evaluateAllCells(store.getState().cells, store) }

export { store }
