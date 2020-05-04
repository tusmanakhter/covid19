import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { EuiInMemoryTable } from '@elastic/eui';
import getKey from '../../helpers/key';

const columns = [
  {
    name: 'Borrough/Linked City',
    field: 'location',
    sortable: true,
    width: '30%',
  },
  {
    name: 'Confirmed',
    field: 'confirmed',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Confirmed Per Capita',
    field: 'perHundred',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Deaths',
    field: 'deaths',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Deaths Per Capita',
    field: 'perHundredDeaths',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Distribution (%)',
    field: 'distribution',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
]

const Table = ({ data, onMouseEnter, onMouseLeave}) => {
  const getRowProps = useCallback((item) => {
    const key = getKey(item.location);

    return {
      onMouseEnter: () => onMouseEnter(key),
      onMouseLeave: () => onMouseLeave(key)
    };
  }, [onMouseEnter, onMouseLeave]);

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
        rowProps={getRowProps}
        loading={data.length === 0}
      />
    </>
  )
}

Table.propTypes = {
  data: PropTypes.array,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

export default Table
