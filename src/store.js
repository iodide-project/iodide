import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'

import createValidatedReducer from './create-validated-reducer'
import reducer from './reducers/reducer'
import { initializeNotebook } from './initialize-notebook'
import { stateSchema } from './state-prototypes'

console.log('stateSchema', stateSchema)
const store = createStore(
  createValidatedReducer(reducer, stateSchema),
  // reducer,
  initializeNotebook(),
  compose(applyMiddleware(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT',
  }))),
)

export { store }
