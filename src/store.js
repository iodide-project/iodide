import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer'
import  { createLogger } from 'redux-logger'
import { initializeNotebook } from './initialize-notebook'

let store = createStore(
  reducer, initializeNotebook(),
  compose(applyMiddleware(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT'
  })))
)

export {store}