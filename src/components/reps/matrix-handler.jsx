import React from 'react'
import { SimpleTable, makeMatrixText } from './pretty-matrix'
import nb from '../../tools/nb'

export default {
  shouldHandle: (value, inContainer) => !inContainer && nb.isMatrix(value),

  render: (value) => {
    const shape = nb.shape(value)
    const dataSetInfo = `${shape[0]} × ${shape[1]} matrix (array of arrays)`
    const tabledata = makeMatrixText(value, [10, 10])
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <SimpleTable tabledata={tabledata} />
      </div>
    )
  },
}
