var utils = {}

function getSelectedCell(cells) {
  let index = cells.slice().findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index]
  } else {
    return undefined // for now
  }
}

utils.getSelectedCell = getSelectedCell
export default utils