import React from 'react'
import PropTypes from 'prop-types'
import { EuiInMemoryTable } from '@elastic/eui';

const columns = [
  {
    name: 'Region',
    field: 'region',
    sortable: true,
  },
  {
    name: 'Cases',
    field: 'cases',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
    width: "20%",
  },
  {
    name: 'Per Capita',
    field: 'perHundred',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
    width: "20%",
  },
]

const Table = ({ data }) => {
  return (
    <>
      <EuiInMemoryTable
        items={data}
        columns={columns}
        search={{
          box: {
            incremental: true,
            schema: true,
          }
        }}
        pagination={{
          pageSizeOptions: [10],
          initialPageSize: 10,
        }}
        sorting={true}
        responsive={false}
        loading={data.length === 0}
      />
    </>
  )
}

Table.propTypes = {
  data: PropTypes.array,
}

export default Table
