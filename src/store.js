import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import reducer from './reducers/reducer'
import { initializeNotebook } from './initialize-notebook'

const store = createStore(
  reducer, initializeNotebook(),
  compose(applyMiddleware(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT',
  }))),
)

export { store }
