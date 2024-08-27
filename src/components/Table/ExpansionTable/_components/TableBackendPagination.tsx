import { Dispatch, Fragment, SetStateAction } from 'react';

import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import getPaginationCopywriting from '@/components/Table/_functions/getPaginationCopywriting';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

import { Meta, TPaginationRequestObject } from '@/types/api';

export interface CustomPaginationProps
  extends Required<TPaginationRequestObject> {
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  meta: Meta;
}

const TablePagination = ({
  setPage,
  setLimit,
  meta,
}: CustomPaginationProps) => {
  /**
   * @description page offset
   */
  const pageSize = meta?.offset ?? 1;
  const pageCount = meta?.pageCount ?? 1;
  const isPageCountTwo = pageCount === 2;
  const isPageCountMoreThanOne = pageCount > 0;
  const pageIndex = meta?.page ?? 1;
  const pagesToShow: number = 3; // Number of pages to show in pagination
  const paginationRange: number[] = Array.from(
    { length: pageCount },
    (_, i) => i + 1,
  );
  const isPageBelowZero = pageIndex <= 0;
  const isCurrentPageLessThanPageCount = pageIndex < pageCount;

  const handleClickPagination = (pageNumber: number | '...') => {
    if (typeof pageNumber === 'number') {
      setPage(pageNumber);
    }
  };
  const handleClickPreviousPagination = () => {
    setPage((prev) => prev - 1);
  };
  const handleClickNextPagination = () => {
    setPage((prev) => prev + 1);
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
                <PaginationLink
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={!isPageBelowZero}
                  onClick={handleClickPreviousPagination}
                >
                  <MdChevronLeft size={18} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  className={cn(
                    'border-2 border-solid border-rs-v2-thunder-blue text-white',
                    'cursor-pointer bg-rs-v2-slate-blue-60%',
                  )}
                  isActive={isCurrentPageLessThanPageCount}
                  onClick={() => {
                    if (isCurrentPageLessThanPageCount) {
                      handleClickNextPagination();
                    }
                  }}
                >
                  <MdChevronRight size={18} />
                </PaginationLink>
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
                  onClick={handleClickPreviousPagination}
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
                      handleClickNextPagination();
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
              value={`${pageSize}`}
              onValueChange={(value: string) => {
                setLimit(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-rs-v2-slate-blue">
                <SelectValue placeholder={pageSize} />
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
              pageSize,
              totalData: meta.itemCount,
            })}
            {/* Showing {pageIndex}-{pageCount} of {meta.itemCount} */}
            {/* {table.getFilteredRowModel().rows.length} of {table.getPageCount()} */}
            {/* {table.getFilteredSelectedRowModel().rows.length} of row(s) selected. */}
          </p>
        </Fragment>
      ) : null}
    </div>
  );
};

export default TablePagination;
