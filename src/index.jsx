import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store.jsx'
import {render} from 'react-dom'
import Page from './page.jsx'

var initialState = {
	cells: [],
	declaredProperties:{}
}

var store = configureStore(initialState)


render(
	<Provider store={store}>
		<Page />
	</ Provider>, document.getElementById('page'))
