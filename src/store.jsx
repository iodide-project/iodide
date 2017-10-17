import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducers/reducer.js'
import { newNotebook } from './notebook-utils.js'
import  { createLogger } from 'redux-logger'

function configureStore() {
	var store = createStore(
		reducer, newNotebook(),
		compose(applyMiddleware(createLogger({
			predicate: (getState, action) => action.type !== 'UPDATE_CELL'
		  }))))
	//persistStore(store)
	return store
}

export default configureStore