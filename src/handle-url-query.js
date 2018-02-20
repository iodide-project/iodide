import { stateFromJsmd } from './jsmd-tools'
import { store } from './store'
import actions from './actions'

function decodeQueryParams(a) {
  if (a === '') return {};
  const b = {};
  for (let i = 0; i < a.length; ++i) {
    const p = a[i].split('=', 2);
    if (p.length === 1) {
      b[p[0]] = ''
    } else {
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
  }
  return b;
}

async function loadJsmdFromNotebookUrl(url) {
  try {
    const response = await fetch(url);
    const notebookString = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(notebookString, 'text/html');
    const jsmd = doc.querySelector('#jsmd').innerHTML
    store.dispatch(actions.importNotebook(stateFromJsmd(jsmd)))
  } catch (err) {
    console.log('failed to load notebook url', err);
  }
}


function handleUrlQuery() {
  const queryParams = decodeQueryParams(window.location.search.substr(1).split('&'));
  if ({}.hasOwnProperty.call(queryParams, 'url')) {
    loadJsmdFromNotebookUrl(queryParams.url)
  } else if ({}.hasOwnProperty.call(queryParams, 'gist')) {
    loadJsmdFromNotebookUrl(`https://gist.githubusercontent.com/${queryParams.gist}/raw/`)
  }
}

export default handleUrlQuery
