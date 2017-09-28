import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer.js'
import { newBlankState } from './reducers/blank-state.js'
import  logger from 'redux-logger'

function configureStore() {
	var store = createStore(
		reducer, newBlankState(),
		compose(applyMiddleware(logger)))
	//persistStore(store)
	return store
}

export default configureStore