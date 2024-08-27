import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

import TablePagination from './_components/TablePagination';

import { Fragment } from 'react';
import { DataTableProps } from '@/types/table';

export interface ExpansionTableProps<TData, TValue>
  extends Omit<DataTableProps<TData, TValue>, 'renderExpansion'> {}

export const ExpansionTable = <TData, TValue>({
  columns,
  data,
  isFullWidth = false,
  backendPagination,
  isShowPagination = true,
  noDataText = 'No results',
}: ExpansionTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!backendPagination && !!isShowPagination,
  });

  return (
    <div className={cn('rounded-md ', isFullWidth && 'w-full')}>
      <Table className="rounded-none border-r-0 border-t-rs-v2-gunmetal-blue">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap border-none bg-rs-v2-slate-blue text-white"
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
        <TableBody className="bg-rs-v2-slate-blue-60%">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-rs-v2-navy-blue-60% py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noDataText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isShowPagination ? (
        backendPagination ? (
          backendPagination
        ) : (
          <TablePagination table={table} />
        )
      ) : null}
    </div>
  );
};

{
  /**
  @name "TableRow"              
  @description this code is commented for optional style
  */
}
// className="border-rs-v2-navy-blue-60%  whitespace-nowrap bg-rs-v2-slate-blue text-white"
