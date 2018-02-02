import React from 'react'
import _ from 'lodash'
import nb from '../tools/nb'

function cellText(matrixLike, i, j) {
  const [numRows, numCols] = nb.shape(matrixLike)
  let text = ''
  if (_.isNumber(i) && _.isNumber(j)) {
    text = nb.prettyFormatNumber(matrixLike[i][j], 6)
  } else if (_.isString(i) && _.isString(j)) {
    text = '⋱'
  } else if (_.isString(i) && (j === 0 || j === numCols - 1)) {
    text = i
  } else if (_.isString(j) && (i === 0 || i === numRows - 1)) {
    text = j
  }
  return text
}

function makeMatrixText(matrixLike, maxDims) {
  const [numRows, numCols] = nb.shape(matrixLike)
  let rowInds
  let colInds

  if (numRows > maxDims[0]) {
    const halfDim = Math.round(maxDims[0] / 2)
    rowInds = _.range(0, halfDim).concat('⋮', _.range(numRows - halfDim, numRows))
  } else {
    rowInds = _.range(numRows)
  }
  if (numCols > maxDims[1]) {
    const halfDim = Math.round(maxDims[1] / 2)
    colInds = _.range(0, halfDim).concat('⋯', _.range(numCols - halfDim, numCols))
  } else {
    colInds = _.range(numCols)
  }

  return rowInds.map(i => colInds.map(j => cellText(matrixLike, i, j)))
}

class PrettyMatrix extends React.Component {
  constructor(props) {
    super(props)
    this.matrix = this.props.matrix
    this.maxDims = this.props.maxDims === undefined ? [10, 10] : this.props.maxDims;
    [this.numRows, this.numCols] = nb.shape(this.matrix)
  }

  cellText(i, j) {
    let text = ''
    if (_.isNumber(i) && _.isNumber(j)) {
      text = nb.prettyFormatNumber(this.matrix[i][j], 6)
    } else if (_.isString(i) && _.isString(j)) {
      text = '⋱'
    } else if (_.isString(i) && (j === 0 || j === this.numCols - 1)) {
      text = i
    } else if (_.isString(j) && (i === 0 || i === this.numRows - 1)) {
      text = j
    }
    return text
  }

  render() {
    const { maxDims, numRows, numCols } = this
    let rowInds
    let colInds

    if (numRows > maxDims[0]) {
      const halfDim = Math.round(maxDims[0] / 2)
      rowInds = _.range(0, halfDim).concat('⋮', _.range(numRows - halfDim, numRows))
    } else {
      rowInds = _.range(numRows)
    }
    if (numCols > maxDims[1]) {
      const halfDim = Math.round(maxDims[1] / 2)
      colInds = _.range(0, halfDim).concat('⋯', _.range(numCols - halfDim, numCols))
    } else {
      colInds = _.range(numCols)
    }

    /* eslint-disable */
    return (
      <table className="matrixTable">
        <tbody>
          {rowInds.map((i, iTr) =>
            // TODO: Do not use array index in keys
            (<tr key={iTr}>
              {colInds.map((j, jTd) =>
                <td key={jTd}>{this.cellText(i, j)}</td>)}
             </tr>))}
        </tbody>
      </table>
    )
    /* eslint-enable */
  }
}


class SimpleTable extends React.Component {
  render() {
    /* eslint-disable */
    return (
      <table className="matrixTable">
        <tbody>
          {this.props.tabledata.map((row, iTr) =>
            // TODO: Do not use array indices in keys
            (<tr key={iTr}>
              {row.map((colText, jTd) =>
                <td key={jTd}>{colText}</td>)}
             </tr>))}
        </tbody>
      </table>
    )
    /* eslint-enable */
  }
}


export { PrettyMatrix, SimpleTable, makeMatrixText }
