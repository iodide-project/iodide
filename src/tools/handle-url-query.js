import queryString from 'query-string'

import { stateFromJsmd } from './jsmd-tools'
import { store } from '../store'
import { importFromURL, evaluateAllCells } from '../actions/actions'
import { importIpynb } from './ipynb-import'

function loadJsmd(jsmd) {
  store.dispatch(importFromURL(stateFromJsmd(jsmd))).then(() => {
    if (store.getState().viewMode === 'presentation') { store.dispatch(evaluateAllCells(store.getState().cells, store)) }
  })
}

async function loadJsmdFromNotebookUrl(url) {
  try {
    const response = await fetch(url);
    const notebookString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(notebookString, 'text/html');
    const jsmd = doc.querySelector('#jsmd').innerHTML
    loadJsmd(jsmd)
  } catch (err) {
    console.error('failed to load notebook url', err);
  }
}

async function loadIpynbFromUrl(url) {
  try {
    const response = await fetch(url)
    const ipynbJson = await response.json()
    const jsmd = importIpynb(url, ipynbJson)
    loadJsmd(jsmd)
  } catch (err) {
    console.error('failed to load ipynb url', err)
  }
}

function loadFromUrlString(urlString) {
  try {
    loadJsmd(urlString)
  } catch (err) {
    console.error('failed to load notebook from urlString', err)
  }
}

function handleUrlQuery() {
  const queryParams = queryString.parse(window.location.search);
  if ({}.hasOwnProperty.call(queryParams, 'url')) {
    loadJsmdFromNotebookUrl(queryParams.url)
  } else if ({}.hasOwnProperty.call(queryParams, 'gist')) {
    loadJsmdFromNotebookUrl(`https://gist.githubusercontent.com/${queryParams.gist}/raw/`)
  } else if ({}.hasOwnProperty.call(queryParams, 'ipynb')) {
    loadIpynbFromUrl(queryParams.ipynb);
  } else if ({}.hasOwnProperty.call(queryParams, 'jsmd')) {
    loadFromUrlString(queryParams.jsmd)
  }
}

export default handleUrlQuery
