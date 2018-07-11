import queryString from 'query-string'

import { stateFromJsmd } from './jsmd-tools'
import { importIpynb } from './ipynb-import'


async function loadJsmdFromNotebookUrl(url) {
  let state
  try {
    const response = await fetch(url);
    const notebookString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(notebookString, 'text/html');
    const jsmd = doc.querySelector('#jsmd').innerHTML
    state = stateFromJsmd(jsmd)
    // loadJsmd(jsmd)
  } catch (err) {
    console.error('failed to load notebook url', err);
  }
  return state
}

async function loadIpynbFromUrl(url) {
  let state
  try {
    const response = await fetch(url)
    const ipynbJson = await response.json()
    const jsmd = importIpynb(url, ipynbJson)
    // loadJsmd(jsmd)
    state = stateFromJsmd(jsmd)
  } catch (err) {
    console.error('failed to load ipynb url', err)
  }
  return state
}

function loadFromUrlString(urlString) {
  let state
  try {
    // loadJsmd(urlString)
    state = stateFromJsmd(urlString)
  } catch (err) {
    console.error('failed to load notebook from urlString', err)
  }
  return state
}

function handleUrlQuery() {
  const queryParams = queryString.parse(window.location.search);
  let state
  if ({}.hasOwnProperty.call(queryParams, 'url')) {
    state = loadJsmdFromNotebookUrl(queryParams.url)
  } else if ({}.hasOwnProperty.call(queryParams, 'gist')) {
    state = loadJsmdFromNotebookUrl(`https://gist.githubusercontent.com/${queryParams.gist}/raw/`)
  } else if ({}.hasOwnProperty.call(queryParams, 'ipynb')) {
    state = loadIpynbFromUrl(queryParams.ipynb);
  } else if ({}.hasOwnProperty.call(queryParams, 'jsmd')) {
    state = loadFromUrlString(queryParams.jsmd)
  }
  return state
}

export default handleUrlQuery
