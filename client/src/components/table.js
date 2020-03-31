import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { EuiInMemoryTable } from '@elastic/eui';

const columns = [
  {
    name: 'Confirmed',
    field: 'latest.confirmed',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Recovered',
    field: 'latest.recovered',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
  {
    name: 'Deaths',
    field: 'latest.deaths',
    sortable: true,
    dataType: 'number',
    render: (value) => value.toLocaleString(),
  },
];

const columnsCountry = [
  {
    name: 'Country',
    field: 'location.country',
    sortable: true,
  },
];

const columnsProvince = [
  {
    name: 'Region',
    field: 'location.province',
    sortable: true,
  },
];

const Table = ({ data, onRowClick, isProvince }) => {
  const getRowProps = useCallback((item) => {
    const { key } = item;
    return {
      onClick: () => onRowClick(key),
    };
  }, [onRowClick]);

  let tableColumns;
  if (isProvince) {
    tableColumns = columnsProvince.concat(columns);
  } else {
    tableColumns = columnsCountry.concat(columns);
  }

  return (
    <>
      <EuiInMemoryTable
        items={data}
        columns={tableColumns}
        search={{
          box: {
            incremental: true,
            schema: true,
          }
        }}
        pagination={{
          pageSizeOptions: [10, 15],
          initialPageSize: 15,
        }}
        sorting={true}
        rowProps={getRowProps}
        responsive={false}
        loading={data.length === 0}
      />
    </>
  )
}

Table.propTypes = {
  onRowClick: PropTypes.func,
  data: PropTypes.array,
  isProvince: PropTypes.bool,
}

export default Table
