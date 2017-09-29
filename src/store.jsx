import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer.js'
import { newNotebook } from './reducers/blank-state.js'
import  logger from 'redux-logger'

function configureStore() {
	var store = createStore(
		reducer, newNotebook(),
		compose(applyMiddleware(logger)))
	//persistStore(store)
	return store
}

export default configureStore