import React from 'react'
import { Grid, VirtualTable, TableHeaderRow, Table } from '@devexpress/dx-react-grid-material-ui'
import { DataTypeProvider, IntegratedSorting, SortingState } from '@devexpress/dx-react-grid'

import { renderValue } from './value-renderer'
import nb from '../../tools/nb'

const ValueFormatter = ({ value }) => (
  <div className="rep-base">
    {renderValue(value, true)}
  </div>
)

const ValueRendererProvider = props => (
  <DataTypeProvider
    formatterComponent={ValueFormatter}
    {...props}
  />
)

// Force heights to be based on contents, not the extremely spacious default
const TableRow = props => (
  <Table.Row
    {... props}
    style={{ height: 'auto' }}
  />
)

export default {
  shouldHandle: (value, inContainer) => !inContainer && nb.isRowDf(value),

  render: (value) => {
    const columns = Object.keys(value[0])
      .map(k => ({ name: k, title: k }))
    const dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    return (
      <div className="dataframe-rep">
        <div className="data-set-info">{dataSetInfo}</div>
        <Grid rows={value} columns={columns}>
          <ValueRendererProvider
            for={Object.keys(value[0])}
          />
          <SortingState
            defaultSorting={[{
              columnName: Object.keys(value[0])[0],
              direction: 'asc',
            }]}
          />
          <IntegratedSorting />
          <VirtualTable
            height={120}
            estimatedRowHeight={24}
            rowComponent={TableRow}
          />
          <TableHeaderRow
            rowComponent={TableRow}
            showSortingControls
          />
        </Grid>
      </div>
    )
  },
}
