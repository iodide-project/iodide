import { applyMiddleware, compose, createStore } from 'redux'
import { reducer, newBlankState } from './reducer.jsx'
import  logger from 'redux-logger'

// let finalCreateStore = compose(
//   applyMiddleware(logger)
// )(createStore)

//  function configureStore(
// 		initialState = {
// 			cells: [],
// 			declaredProperties:{},
// 			lastValue: undefined
// 		}) {
//   return finalCreateStore(reducer, initialState)
// }

function configureStore() {
	var store = createStore(
		reducer, newBlankState(),
		compose(applyMiddleware(logger)))
	//persistStore(store)
	return store
}

export default configureStore