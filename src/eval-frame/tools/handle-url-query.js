import queryString from 'query-string'

import { stateFromJsmd } from './jsmd-tools'
import { store } from '../store'
import { importFromURL, evaluateAllCells } from '../actions/actions'

async function loadJsmdFromNotebookUrl(url) {
  try {
    const response = await fetch(url);
    const notebookString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(notebookString, 'text/html');
    const jsmd = doc.querySelector('#jsmd').innerHTML
    store.dispatch(importFromURL(stateFromJsmd(jsmd))).then(() => {
      if (store.getState().viewMode === 'presentation') { store.dispatch(evaluateAllCells(store.getState().cells, store)) }
    })
  } catch (err) {
    console.error('failed to load notebook url', err);
  }
}


function handleUrlQuery() {
  const queryParams = queryString.parse(window.location.search);
  if ({}.hasOwnProperty.call(queryParams, 'url')) {
    loadJsmdFromNotebookUrl(queryParams.url)
  } else if ({}.hasOwnProperty.call(queryParams, 'gist')) {
    loadJsmdFromNotebookUrl(`https://gist.githubusercontent.com/${queryParams.gist}/raw/`)
  }
}

export default handleUrlQuery
