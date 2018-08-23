import _ from 'lodash'

export function newCellFromSchema(schema, cellId, cellType = 'code', language = 'js') {
  const cell = {}
  Object.keys(schema.properties).forEach((k) => {
    // we must clone object prototypes to avoid creating multiple references
    // to the same actual object
    cell[k] = _.cloneDeep(schema.properties[k].default)
  })
  cell.id = cellId
  cell.cellType = cellType
  cell.language = language
  return cell
}

export function newNotebookFromSchema(schema) {
  const initialState = {}
  Object.keys(schema.properties).forEach((k) => {
    // we must clone object prototypes to avoid creating multiple references
    // to the same actual object
    initialState[k] = _.cloneDeep(schema.properties[k].default)
  })
  initialState.cells[0].selected = true
  return initialState
}
