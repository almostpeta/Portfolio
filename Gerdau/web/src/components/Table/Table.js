import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  ReactTable,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { TableStyles, PaginationButton } from "./styles";
import ArrowSortingIcon from "./arrowIcon";
import { matchSorter } from "match-sorter";

// Define a default UI for filtering
const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Búsqueda General:{" "}
      <input
        className="w-75 p-1"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} registros...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
};

// Define a default UI for filtering
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter, canFilter },
}) => {
  return (
    <input
      className="p-1"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Buscar `}
    />
  );
};

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
};

export const Table = ({ columns, data }) => {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),

    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
    preGlobalFilteredRows,
    visibleColumns,
    setGlobalFilter,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <TableStyles>
      <div className="table-responsive-lg">
        <table className="table table-bordered" {...getTableProps()}>
          <thead>
            <tr>
              <th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: "left",
                }}
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </th>
            </tr>
            {headerGroups.map((headerGroup) => {
              const {
                key,
                ...headerGroupProps
              } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...headerProps } = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <th key={key}>
                        <div {...headerProps}>
                          {column.render("Header")}
                          <span className="caret-4-desc">
                            {column.id !== "action" && (
                              <ArrowSortingIcon
                                status={
                                  column.isSortedDesc === undefined
                                    ? "default"
                                    : column.isSortedDesc
                                    ? "desc"
                                    : "asc"
                                }
                              />
                            )}
                          </span>
                        </div>

                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const { key, ...rowProps } = row.getRowProps();
              return (
                <tr
                  key={key}
                  {...rowProps}
                  className={`${data[row.index].status}`}
                >
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <td key={key} {...restCellProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination d-flex align-items-center">
          <PaginationButton
            className="page-item"
            onClick={() => gotoPage(0)}
            className={!canPreviousPage ? "disabled" : ""}
          >
            {"<<"}
          </PaginationButton>{" "}
          <PaginationButton
            onClick={() => previousPage()}
            className={!canPreviousPage ? "disabled" : ""}
          >
            {"<"}
          </PaginationButton>{" "}
          <PaginationButton
            onClick={() => nextPage()}
            className={!canNextPage ? "disabled" : ""}
          >
            {">"}
          </PaginationButton>{" "}
          <PaginationButton
            onClick={() => gotoPage(pageCount - 1)}
            className={!canNextPage ? "disabled" : ""}
          >
            {">>"}
          </PaginationButton>{" "}
          <span>
            Página{" "}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{" "}
          </span>
          <span className="ml-2">
            | Ir a la página:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
        </div>
      </div>
    </TableStyles>
  );
};
