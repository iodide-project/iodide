
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store.jsx'
import {render} from 'react-dom'
import Page from './page.jsx'

function runFunction(code) {
	return new Function(code)
}

var store = configureStore()

render(
	<Provider store={store}>
		<Page />
	</ Provider>, document.getElementById('page'))
