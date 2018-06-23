/* global IODIDE_BUILD_MODE */
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import createValidatedReducer from './reducers/create-validated-reducer'
import reducer from './reducers/reducer'
import { stateSchema, newNotebook } from './state-prototypes'

let enhancer
let finalReducer

if (IODIDE_BUILD_MODE === 'dev' || IODIDE_BUILD_MODE === 'devperf') {
  finalReducer = createValidatedReducer(reducer, stateSchema)
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(createLogger({
      predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT',
    })),
  )
} else if (IODIDE_BUILD_MODE === 'test') {
  finalReducer = createValidatedReducer(reducer, stateSchema)
  enhancer = applyMiddleware(thunk)
} else {
  finalReducer = reducer
  enhancer = applyMiddleware(thunk)
}

const initialState = newNotebook()

const store = createStore(finalReducer, initialState, enhancer)

const { dispatch } = store

export { store, dispatch }
