/* global IODIDE_BUILD_MODE IODIDE_REDUX_LOG_MODE */
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducer from './reducers/reducer'
import { newNotebook } from '../editor-state-prototypes'
import evalFrameStateSelector from '../state-schemas/eval-frame-state-selector'

let enhancer

if (IODIDE_BUILD_MODE === 'production') {
  enhancer = applyMiddleware(thunk)
} else if (IODIDE_BUILD_MODE === 'test' || IODIDE_REDUX_LOG_MODE === 'SILENT') {
  enhancer = applyMiddleware(thunk)
} else {
  enhancer = compose(
    applyMiddleware(thunk),
    applyMiddleware(createLogger({
      predicate: (getState, action) => action.type !== 'UPDATE_INPUT_CONTENT',
      colors: { title: () => '#27ae60' },
    })),
  )
}

const initialState = evalFrameStateSelector(newNotebook())

const store = createStore(reducer, initialState, enhancer)

const { dispatch } = store

export { store, dispatch }
