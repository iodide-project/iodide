import { evaluateCell } from './actions'

export default async function evaluateAllCells(cells, store) {
  let p = Promise.resolve()
  cells.forEach((cell) => {
    if (cell.cellType === 'css' && !cell.skipInRunAll) {
      p = p.then(() => store.dispatch(evaluateCell(cell.id)))
    }
  })
  cells.forEach((cell) => {
    if (cell.cellType === 'markdown' && !cell.skipInRunAll) {
      p = p.then(() => store.dispatch(evaluateCell(cell.id)))
    }
  })
  cells.forEach((cell) => {
    if (cell.cellType !== 'markdown' && cell.cellType !== 'css' && !cell.skipInRunAll) {
      p = p.then(() => store.dispatch(evaluateCell(cell.id)))
    }
  })
}
