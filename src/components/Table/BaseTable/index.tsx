import { Fragment, useEffect, useMemo, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  Row,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';

import Checkbox from '@/components/Checkbox';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Spinner from '@/components/Spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

import { DataTableProps } from '@/types/table';

import TablePagination from './_components/TablePagination';
import TableToolbar from './_components/TableToolbar';
import { useSearchParams } from 'react-router-dom';

export const BaseTable = <TData, TValue>({
  columns,
  data,
  isFullWidth = false,
  backendPagination,
  renderExpansion,
  isShowNumbering = true,
  onExportButton,
  exportName,
  exportText,
  onSearchInput,
  withToolbar,
  isLoading,
  additionalSuffixToolbarElement,
  additionalPrefixToolbarElement,
  searchInputValue,
  meta,
  hideColumns,
  onSearchInputChange,
  onRowClick,
  setSelectedRows,
  hidePagination = false,
  quickAccessToolbarChildren,
  name,
  noDataText,
  inlineSearchWithPrefix,
  exportParams,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const visibleColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    const renderedColumns = [...columns];
    const filteredColumns = renderedColumns.filter((col) => {
      if ('accessorKey' in col && col.accessorKey) {
        return !hideColumns?.includes(col.accessorKey as string);
      }
      return true;
    });

    const isExpansionExist = !!renderExpansion;
    isShowNumbering &&
      filteredColumns.unshift({
        accessorKey: 'no',
        header: 'No.',
        maxSize: 10,
        cell: (context) => {
          const addition = meta ? (meta.page - 1) * meta.offset : 0;
          return setSelectedRows ? (
            <DivPropagationWrapper className="inline-flex items-center gap-2">
              <Checkbox
                checked={context.row.getIsSelected()}
                onChange={(e) => context.row.toggleSelected(e.target.checked)}
              />
              {context.row.index + 1 + addition}
            </DivPropagationWrapper>
          ) : (
            <p>{context.row.index + 1 + addition}</p>
          );
        },
      });

    isExpansionExist &&
      filteredColumns.push({
        accessorKey: 'no',
        header: '',
        id: 'expansion',
        maxSize: 10,
        cell: ({ row }) => {
          return (
            <HiOutlineChevronDown
              className={cn(
                row.getIsExpanded() && 'rotate-180 transform',
                'transition-all',
              )}
            />
          );
        },
      });
    return filteredColumns;
  }, [
    columns,
    hideColumns,
    isShowNumbering,
    renderExpansion,
    meta,
    setSelectedRows,
  ]);
  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: {
      pagination: !hidePagination
        ? {
            pageIndex: meta?.page ?? 0,
            pageSize: meta?.offset ?? 10,
          }
        : undefined,
      rowSelection,
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        setRowSelection(updater(rowSelection));
      }
    },
    pageCount: meta?.pageCount ?? undefined,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: !hidePagination
      ? getPaginationRowModel()
      : undefined,
    manualPagination: !!backendPagination,
    getExpandedRowModel: getExpandedRowModel(),
    manualExpanding: true,
    autoResetPageIndex: true,
    getRowId: (row) => {
      //@ts-ignore
      return row.id as unknown as string;
    },
  });

  /**
   * Effect to update selected rows ensuring it only happens if there's an actual change.
   * Dependencies are kept stable to avoid unnecessary re-renders.
   */
  useEffect(() => {
    const flatRows = table.getSelectedRowModel().flatRows;
    const selectedRows = Object.keys(rowSelection);

    const sanitizeSelectedRows = (prev: Row<TData>[]) => {
      const newSelectedRows = Array.from(
        new Set(selectedRows.map((obj) => Number(obj))),
      ).map(
        (id) => [...prev, ...flatRows].find((obj) => Number(obj?.id) === id)!,
      );
      return newSelectedRows;
    };

    setSelectedRows &&
      setSelectedRows((prev) => {
        const newSelectedRows = sanitizeSelectedRows(prev);
        if (JSON.stringify(newSelectedRows) !== JSON.stringify(prev)) {
          return newSelectedRows;
        }
        return prev;
      });
  }, [rowSelection, setSelectedRows, table]);

  const [searchParams, setSearchParams] = useSearchParams();
  const getPageParams = searchParams.get('page');

  // re-assigned pageParams when data === 0
  /**
   * Effect to adjust the search params when data is empty and page number is greater than 1.
   * Updates search params only if there's an actual change to prevent infinite re-renders.
   */
  useEffect(() => {
    if (isLoading) return;
    if (getPageParams && Number(getPageParams) > 1 && data.length === 0) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', (Number(getPageParams) - 1).toString());
      if (newSearchParams.toString() !== searchParams.toString()) {
        setSearchParams(newSearchParams);
      }
    }
  }, [data, getPageParams, searchParams, setSearchParams, isLoading]);

  return (
    <div className={cn('rounded-md', isFullWidth && 'w-full')}>
      {withToolbar && (
        <TableToolbar
          onExportButton={onExportButton}
          exportName={exportName}
          exportText={exportText}
          searchInputValue={searchInputValue}
          onSearchInput={onSearchInput}
          additionalPrefixToolbarElement={additionalPrefixToolbarElement}
          onSearchInputChange={onSearchInputChange}
          additionalSuffixToolbarElement={additionalSuffixToolbarElement}
          inlineSearchWithPrefix={inlineSearchWithPrefix}
          exportParams={exportParams}
        />
      )}

      <Table aria-label={name}>
        <TableHeader>
          {setSelectedRows ? (
            <TableRow>
              <TableHead
                colSpan={table.getAllColumns().length}
                className="whitespace-nowrap bg-rs-v2-navy-blue py-2 text-white"
              >
                <div className="inline-flex items-center gap-2">
                  <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onChange={(e) => {
                      table.toggleAllRowsSelected(e.target.checked);
                    }}
                  />
                  {quickAccessToolbarChildren}
                </div>
              </TableHead>
            </TableRow>
          ) : null}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap bg-rs-v2-navy-blue text-white"
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-rs-v2-galaxy-blue">
          {table.getRowModel().rows?.length ? (
            <Fragment>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    className={cn(!!renderExpansion && 'cursor-pointer')}
                    onClick={() => {
                      row.toggleExpanded();
                      onRowClick && onRowClick(row);
                    }}
                    // data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && !!renderExpansion ? (
                    <TableRow className="cursor-pointer bg-rs-v2-navy-blue-60% hover:bg-transparent">
                      <TableCell
                        className={cn(
                          'p-0',
                          row.getIsExpanded() &&
                            'border-x-2 border-y-0 border-r-0 border-solid border-l-rs-v2-mint border-t-rs-v2-gunmetal-blue',
                        )}
                        colSpan={table.getAllColumns().length}
                      >
                        {renderExpansion(row)}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              ))}
            </Fragment>
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="h-24 w-full text-center"
              >
                {isLoading ? (
                  <Spinner isFullWidthAndHeight={false} />
                ) : (
                  noDataText || 'No data available'
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!hidePagination &&
        (backendPagination ? (
          backendPagination
        ) : (
          <TablePagination table={table} />
        ))}
    </div>
  );
};
