import tstyles from '@pages/files-table.module.scss';
import styles from '@pages/app.module.scss';
import React, { useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';

const FilesTable = ({ files }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Local id',
        accessor: (data) => String(data.id).padStart(9, '0'),
        Cell: ({ value }) => <div style={{fontFamily: 'Mono', opacity: 0.4 }}>{value}</div>,
        disableFilters: true,
        width: '20%',
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
        Filter: DefaultColumnFilter,
      },

      {
        Header: 'Retrieval Link',
        accessor: (data) => {
          
            return data.cid != null ? `https://api.estuary.tech/gw/ipfs/${data.cid['/']}` : '/'
          
        },
        Cell: ({ value }) => (
          <a href={value} style={{overflowWrap:'break-word'}}target="_blank" className={tstyles.cta}>
            {value}
          </a>
        ),
        width: '35%',
        Filter: DefaultColumnFilter,
      },

      {
        Header: 'Files',
        accessor: (data) => data.aggregatedFiles + 1,
        disableFilters: true,
        width: '15%',
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
        className='filter' 
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  return (
    <React.Fragment>
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
                        width: column.width,
                      },
                    },
                  ])}
                >
                  <div {...column.getSortByToggleProps()} className={tstyles.hContainer}>
                    <div className={tstyles.hInnerContainer}>
                      <div className={tstyles.hTitle}><div>{column.render('Header')}</div> <div>{column.canFilter ? column.render('Filter') : null}</div></div>
                      <div className={tstyles.sortIcon}>{column.isSorted ? (column.isSortedDesc ? (<div><div>▲</div><div>▽</div></div>) : (<div><div>△</div><div>▼</div></div>) ) : <div><div>▲</div><div>▼</div></div>}</div>
                    </div>
                    
                  </div>
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
      <div className="pagination" style={{ fontSize: "1em", fontFamily: 'Mono', padding: '0.5rem' }}>
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
      </React.Fragment>
  );
};

export default FilesTable;
