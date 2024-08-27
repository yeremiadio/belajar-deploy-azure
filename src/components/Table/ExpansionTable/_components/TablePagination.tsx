import { Fragment } from 'react';
import { Table } from '@tanstack/react-table';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import getPaginationCopywriting from '@/components/Table/_functions/getPaginationCopywriting';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

const TablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex + 1;
  const isPageCountTwo = pageCount === 2;
  const isPageCountMoreThanOne = pageCount > 0;
  const pagesToShow: number = 3; // Number of pages to show in pagination
  const paginationRange: number[] = Array.from(
    { length: pageCount },
    (_, i) => i + 1,
  );
  const isPageBelowZero = pageIndex <= 0;
  const isCurrentPageLessThanPageCount = pageIndex < pageCount;

  const handleClickPagination = (pageNumber: number | '...') => {
    if (typeof pageNumber === 'number') {
      table.setPageIndex(pageNumber);
    }
  };

  const renderPagination = (): JSX.Element[] => {
    let pagination: (number | '...')[] = [];

    if (pageCount <= pagesToShow) {
      pagination = paginationRange;
    } else {
      const middleIndex: number = Math.ceil(pagesToShow / 2);
      const startPage: number =
        pageIndex <= middleIndex
          ? 1
          : pageIndex >= pageCount - middleIndex
            ? pageCount - pagesToShow + 1
            : pageIndex - middleIndex + 1;
      const endPage: number = Math.min(startPage + pagesToShow - 1, pageCount);

      if (startPage > 1) {
        pagination.push(1);
        if (startPage > 2) {
          pagination.push('...');
        }
      }

      for (let i: number = startPage; i <= endPage; i++) {
        pagination.push(i);
      }

      if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
          pagination.push('...');
        }
        pagination.push(pageCount);
      }
    }
    return pagination.map((page, index) => {
      const isCurrent: boolean = page === pageIndex;
      const isEllipsis: boolean = page === '...';
      if (isEllipsis) {
        return (
          <PaginationItem key={index}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        return (
          <PaginationItem key={index}>
            <PaginationLink
              className={cn(
                isCurrent
                  ? 'border-2 border-solid border-rs-v2-mint text-rs-v2-mint'
                  : 'border-2 border-solid border-rs-v2-thunder-blue text-white',
                'cursor-pointer bg-rs-v2-slate-blue-60%',
              )}
              isActive={isCurrent}
              onClick={() => {
                const pageNum: number = typeof page === 'number' ? page - 1 : 0;
                handleClickPagination(pageNum);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <Pagination className="flex-1 justify-start">
        <PaginationContent className="gap-3">
          {isPageCountTwo ? (
            <Fragment>
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={!isPageBelowZero}
                  onClick={() => table.previousPage()}
                />
                {/* <PaginationLink
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={!isPageBelowZero}
                  onClick={() => table.previousPage()}
                >
                  <MdChevronLeft size={18} />
                </PaginationLink> */}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={isCurrentPageLessThanPageCount}
                  onClick={() => {
                    if (isCurrentPageLessThanPageCount) {
                      table.nextPage();
                    }
                  }}
                />
                {/* <PaginationLink
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={isCurrentPageLessThanPageCount}
                  onClick={() => {
                    if (isCurrentPageLessThanPageCount) {
                      table.nextPage();
                    }
                  }}
                >
                  <MdChevronRight size={18} />
                </PaginationLink> */}
              </PaginationItem>
            </Fragment>
          ) : pageCount > 2 ? (
            <Fragment>
              <PaginationItem>
                <PaginationLink
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={!isPageBelowZero}
                  onClick={() => table.previousPage()}
                >
                  <MdChevronLeft size={18} />
                </PaginationLink>
              </PaginationItem>
              <Fragment>{renderPagination()}</Fragment>
              <PaginationItem>
                <PaginationLink
                  isActive={isCurrentPageLessThanPageCount}
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  onClick={() => {
                    if (isCurrentPageLessThanPageCount) {
                      table.nextPage();
                    }
                  }}
                >
                  <MdChevronRight size={18} />
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          ) : null}
        </PaginationContent>
      </Pagination>
      {isPageCountMoreThanOne ? (
        <Fragment>
          <div className="inline-block">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-rs-v2-slate-blue">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="ml-2 text-sm text-muted-foreground">
            {getPaginationCopywriting({
              pageIndex,
              pageSize: pageCount,
              totalData: table.getFilteredRowModel().rows.length,
            })}
            {/* {table.getFilteredRowModel().rows.length} of {table.getPageCount()} */}
            {/* {table.getFilteredSelectedRowModel().rows.length} of row(s) selected. */}
          </p>
        </Fragment>
      ) : null}
    </div>
  );
};

export default TablePagination;
