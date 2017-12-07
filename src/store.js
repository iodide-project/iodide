import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer'
import  { createLogger } from 'redux-logger'
import { newNotebook } from './state-prototypes.js'

let store = createStore(
  reducer, newNotebook(),
  compose(applyMiddleware(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT'
  })))
)

export {store}