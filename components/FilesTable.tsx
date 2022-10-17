import tstyles from '@pages/table.module.scss';
import { useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Button from '@components/Button';
import * as R from '@common/requests';

const FilesTable = ({ files }) => {
  const deleteButtonStyles = {
    'background-color': '#8B0000',
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Local id',
        accessor: (data) => String(data.id).padStart(9, '0'),
        Cell: ({ value }) => <div style={{ fontSize: 12, fontFamily: 'Mono', opacity: 0.4 }}>{value}</div>,
        width: '8%',
        maxWidth: '8%',
        disableFilters: true,
      },

      {
        Header: 'Name',
        accessor: (data) => {
          if (data.name) {
            return data.name;
          }
          if (data.filename) {
            return data.filename;
          }
          if (data.name === 'aggregate') {
            return '/';
          }
        },
        width: '30%',
        maxWidth: '30%',
        Filter: DefaultColumnFilter,
      },

      {
        Header: 'Retrieval Link',
        accessor: (data) => `https://dweb.link/ipfs/${data.cid['/']}`,
        Cell: ({ value }) => (
          <a href={value} target="_blank" className={tstyles.cta}>
            {value}
          </a>
        ),
        width: '55%',
        maxWidth: '55%',
        Filter: DefaultColumnFilter,
      },

      {
        Header: 'Files',
        accessor: (data) => data.aggregatedFiles + 1,
        width: '8%',
        maxWidth: '8%',
        disableFilters: true,
      },
      {
        Header: 'Delete',
        accessor: (data) => String(data.id).padStart(9, '0'),
        Cell: ({ value }) => (
          <div style={{ fontSize: 12, fontFamily: 'Mono', opacity: 0.4 }}>
            {' '}
            <Button
              htmlFor="FILE_UPLOAD_TARGET"
              onClick={async () => {
                const confirm = window.confirm('Are you sure you want to delete this file?');
                if (!confirm) {
                  return;
                }

                R.del(`/pinning/pins/${value}`);
              }}
              type="file"
              style={deleteButtonStyles}
            >
              Delete
            </Button>
          </div>
        ),
        // accessor: (data) => data.aggregatedFiles + 1,
        width: '9%',
        maxWidth: '9%',
        disableFilters: true,
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: files, initialState: { pageIndex: 0, pageSize: 10 } }, useFilters, useSortBy, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length;

    return (
      <input
        style={{ width: '50%', padding: '0.2rem', margin: '0.3rem 0', fontSize: '0.7rem', border: '1px solid #ccc', fontFamily: 'Mono' }}
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  return (
    <div>
      <table className={tstyles.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className={tstyles.tr} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className={tstyles.th}
                  {...column.getHeaderProps([
                    {
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                      },
                    },
                  ])}
                >
                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' ↑' : ' ↓') : ' ↕'}
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={tstyles.tbody} {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr className={tstyles.tr} {...row.getRowProps([{ style: {} }])}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={tstyles.td}
                      {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                        },
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination" style={{ fontSize: 12, fontFamily: 'Mono', padding: '0.5rem' }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '2rem', outline: 'none', padding: '0.2rem', fontFamily: 'Mono', fontSize: 10 }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ outline: 'none', padding: '0.2rem', fontFamily: 'Mono', fontSize: 10 }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilesTable;
