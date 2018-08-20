import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers'

const history = createBrowserHistory()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(thunk),
    applyMiddleware(
      routerMiddleware(history),
    ),
  ),
)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Component history={history} />
    </Provider>,
    document.getElementById('react')
  );
}

render(App)

if (module.hot) {
module.hot.accept('./App', () => {
  const NextApp = require('./App').default;
    render(NextApp);
  })
}
