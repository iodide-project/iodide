
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store.jsx'
import {render} from 'react-dom'
import Page from './page.jsx'
import { loadState, saveState } from './persistent-state.jsx'


function runFunction(code) {
	return new Function(code)
}


var initialState = {
	title: undefined,
	cells: [],
	currentlySelected: undefined,
	declaredProperties:{},
	lastValue: undefined,
	lastSaved: undefined,
	mode: 'command'
}

var store = configureStore(initialState)

render(
	<Provider store={store}>
		<Page />
	</ Provider>, document.getElementById('page'))
