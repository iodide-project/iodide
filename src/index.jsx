
import React from 'react'
import { Provider } from 'react-redux'
// import configureStore from './store.jsx'
import {render} from 'react-dom'
import Page from './page.jsx'

import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer.js'
import  { createLogger } from 'redux-logger'
import { newNotebook } from './state-prototypes.js'

function configureStore() {
  let store = createStore(
    reducer, newNotebook(),
    compose(applyMiddleware(createLogger({
      predicate: (getState, action) => action.type !== 'UPDATE_CELL'
    }))))
  //persistStore(store)
  return store
}

let store = configureStore()

render(
  <Provider store={store}>
    <Page />
  </Provider>, document.getElementById('page'))

export {store}
