import actions from './actions'

export default function evaluateAllCells(cells, store) {
  cells.forEach((cell) => {
    if (cell.cellType === 'css') {
      store.dispatch(actions.evaluateCell(cell.id))
    }
  })
  cells.forEach((cell) => {
    if (cell.cellType === 'markdown') {
      store.dispatch(actions.evaluateCell(cell.id))
    }
  })
  window.setTimeout(
    () => {
      cells.forEach((cell) => {
        if (cell.cellType !== 'markdown' && cell.cellType !== 'markdown') {
          store.dispatch(actions.evaluateCell(cell.id))
        }
      })
    },
    42, // wait a few milliseconds to let React DOM updates flush
  )
}
