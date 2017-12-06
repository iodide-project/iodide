import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer.js'
import  { createLogger } from 'redux-logger'
import { newNotebook } from './notebook-utils.js'

function configureStore() {
  let store = createStore(
    reducer, newNotebook(),
    compose(applyMiddleware(createLogger({
      predicate: (getState, action) => action.type !== 'UPDATE_CELL'
    }))))
  //persistStore(store)
  return store
}

export default configureStore