import queryString from 'query-string'

import { importIpynb } from './ipynb-import'

async function loadJsmdFromNotebookUrl(url) {
  let state
  try {
    const response = await fetch(url);
    const notebookString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(notebookString, 'text/html');
    state.jsmd = doc.querySelector('#jsmd').innerHTML
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
    state.jsmd = importIpynb(url, ipynbJson)
  } catch (err) {
    console.error('failed to load ipynb url', err)
  }
  return state
}

export function getUrlParams() {
  return queryString.parse(window.location.search)
}

export function objectToQueryString(obj) {
  return queryString.stringify(obj)
}

export function getStatePropsFromUrlParams() {
  const queryParams = getUrlParams()
  const report = queryParams.viewMode === 'report'
  return { viewMode: report ? 'REPORT_VIEW' : 'EXPLORE_VIEW' }
}

export const JSMD_QUERY_PARAMS = new Set(['url', 'gist', 'ipynb', 'jsmd'])

export function getStateFromJsmdQueryParams() {
  const queryParams = getUrlParams()
  let state
  if ({}.hasOwnProperty.call(queryParams, 'url')) {
    state = loadJsmdFromNotebookUrl(queryParams.url)
  } else if ({}.hasOwnProperty.call(queryParams, 'gist')) {
    state = loadJsmdFromNotebookUrl(`https://gist.githubusercontent.com/${queryParams.gist}/raw/`)
  } else if ({}.hasOwnProperty.call(queryParams, 'ipynb')) {
    state = loadIpynbFromUrl(queryParams.ipynb);
  }
  return state
}
