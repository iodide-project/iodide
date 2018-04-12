import React from 'react'
import ReactTable from 'react-table'

import { renderValue } from './value-renderer'
import nb from '../../tools/nb'

export default {
  shouldHandle: (value, inContainer) => !inContainer && nb.isRowDf(value),

  render: (value) => {
    const columns = Object.keys(value[0])
      .map(k => ({
        Header: k,
        accessor: k,
        Cell: cell => renderValue(cell.value, true),
      }))
    const dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    const pageSize = value.length > 10 ? 10 : value.length
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <ReactTable
          data={value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          minRows={0}
          defaultPageSize={pageSize}
        />
      </div>
    )
  },
}
