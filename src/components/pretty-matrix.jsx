import React from 'react'
import _ from 'lodash'
import nb from '../../tools/nb.js'

function cellText(matrixLike,i,j){
  let [numRows, numCols] = nb.shape(matrixLike)
  let text =''
  if (_.isNumber(i) && _.isNumber(j)) {
    text = nb.prettyFormatNumber(matrixLike[i][j],6)
  }
  else if ( _.isString(i) && _.isString(j)) {text = '⋱'}
  else if ( _.isString(i) && (j==0 || j==numCols-1) ) {text = i}
  else if ( _.isString(j) && (i==0 || i==numRows-1) ) {text = j}
  return text
}

function makeMatrixText(matrixLike,maxDims){
  let [numRows, numCols] = nb.shape(matrixLike)

  if (numRows>maxDims[0]){
    var halfDim = Math.round(maxDims[0]/2)
    var rowInds = _.range(0,halfDim).concat('⋮', _.range(numRows-halfDim,numRows))
  } else {
    var rowInds = _.range(numRows)
  }
  if (numCols>maxDims[1]){
    var halfDim = Math.round(maxDims[1]/2)
    var colInds = _.range(0,halfDim).concat('⋯', _.range(numCols-halfDim,numCols))
  } else {
    var colInds = _.range(numCols)
  }

  return rowInds.map(
    i => colInds.map(
      j => cellText(matrixLike, i, j)
    )
  )
}

class PrettyMatrix extends React.Component {
  constructor(props) {
    super(props)
    this.matrix = this.props.matrix
    this.maxDims = this.props.maxDims==undefined ? [10,10] : this.props.maxDims;
    [this.numRows, this.numCols] =  nb.shape(this.matrix)
  }

  cellText(i,j){
    let text =''
    if (_.isNumber(i) && _.isNumber(j)) {
      text = nb.prettyFormatNumber(this.matrix[i][j],6)
    }
    else if ( _.isString(i) && _.isString(j)) {text = '⋱'}
    else if ( _.isString(i) && (j==0 || j==this.numCols-1) ) {text = i}
    else if ( _.isString(j) && (i==0 || i==this.numRows-1) ) {text = j}
    return text
  }

  render() {
    let [matrix, maxDims, numRows, numCols] = [
      this.matrix, this.maxDims, this.numRows, this.numCols]

    if (numRows>maxDims[0]){
      var halfDim = Math.round(maxDims[0]/2)
      var rowInds = _.range(0,halfDim).concat('⋮', _.range(numRows-halfDim,numRows))
    } else {
      var rowInds = _.range(numRows)
    }
    if (numCols>maxDims[1]){
      var halfDim = Math.round(maxDims[1]/2)
      var colInds = _.range(0,halfDim).concat('⋯', _.range(numCols-halfDim,numCols))
    } else {
      var colInds = _.range(numCols)
    }

    return (
      <table className="matrixTable">
        <tbody>
          {rowInds.map((i, i_tr) =>
            <tr key={i_tr}>
              {colInds.map((j, j_td) =>
                <td key={j_td}>{this.cellText(i,j)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}


class SimpleTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <table className="matrixTable">
        <tbody>
          {this.props.tabledata.map((row, i_tr) =>
            <tr key={i_tr}>
              {row.map((colText, j_td) =>
                <td key={j_td}>{colText}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}


export {PrettyMatrix, SimpleTable, makeMatrixText}