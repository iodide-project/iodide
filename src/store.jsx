import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducer.jsx'
import  logger from 'redux-logger'
import Interpreter from 'js-interpreter'

let finalCreateStore = compose(
  applyMiddleware(logger)
)(createStore)


 function configureStore(
		initialState = {
			cells: []
		}) {
  console.log('WTF is happening??')
  return finalCreateStore(reducer, initialState)
}

export default configureStore