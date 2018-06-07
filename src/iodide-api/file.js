import matrix from '../components/reps/matrix-handler'
import dataframe from '../components/reps/dataframe-handler'
import array from '../components/reps/array-handler'
import { downloadResource } from '../reducers/notebook-reducer'
// THIS CAUSES SOME TESTS TO FAIL FOR SOME REASON.
// TODO: investigate why having downloadResource in notebook-utils causes a test failure
// in reducers/__tests__/notebook-reducer.test.js. No other test breaks because of
// downloadResource being elsewhere.
// import { downloadResource } from '../tools/notebook-utils'

export function toCSVString(data, delimiter = ',', header = true) {
  let headerRow = ''
  let body = []
  if (matrix.shouldHandle(data)) {
    if (header) headerRow = `${data[0].map((d, i) => `c${i + 1}`)}\r\n`
    body = data.map(r => r.join(delimiter))
  } else if (dataframe.shouldHandle(data)) {
    const keys = Object.keys(data[0])
    if (header) headerRow = `${keys}\r\n`
    body = data.map(row => `${keys.map(k => row[k]).join(delimiter)}`)
  } else if (array.shouldHandle(data)) body = data
  else throw Error('data is not in the correct format for csv export.')
  return `${headerRow}${body.join('\r\n')}`
}

export function exportCSV(data, filename, delimiter = ',') {
  const content = `data:text/csv;charset=utf-8,${encodeURIComponent(toCSVString(data, delimiter))}`
  downloadResource(content, filename)
}

export function exportJSON(data, filename = undefined, level = 0) {
  const out = JSON.stringify(data, null, level)
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(out)}`
  downloadResource(dataStr, filename)
}

export function exportRaw(data, filename = undefined) {
  const blob = new Blob(data, { type: 'octet/stream' })
  const url = window.URL.createObjectURL(blob)
  downloadResource(url, filename)
}

export const file = {
  exportJSON,
  exportRaw,
  exportCSV,
}
