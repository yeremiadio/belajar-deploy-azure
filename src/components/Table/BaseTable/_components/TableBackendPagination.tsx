import { isEqual } from 'lodash';
import { Dispatch, Fragment, SetStateAction, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

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

import usePrevious from '@/utils/hooks/usePrevious';

export interface CustomPaginationProps
  extends Required<TPaginationRequestObject> {
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
  meta: Meta;
  syncWithParams?: boolean;
}

const TableBackendPagination = ({
  setPage,
  setLimit,
  meta,
  take,
  page,
  syncWithParams = true,
}: CustomPaginationProps) => {
  /**
   * @description page offset
   */
  const pageSize = meta?.offset ?? 1;
  const pageCount = meta?.pageCount ?? 1;
  const isPageCountMoreThanOne = pageCount > 0;
  const pageIndex = meta?.page ?? 1;
  const pagesToShow: number = 3; // Number of pages to show in pagination
  const paginationRange: number[] = Array.from(
    { length: pageCount },
    (_, i) => i + 1,
  );
  const isPageBelowZero = pageIndex <= 1;
  const isPageBelowPageCount = pageIndex < pageCount;

  const [searchParams, setSearchParams] = useSearchParams();

  const handleClickPagination = (pageNumber: number | '...') => {
    if (typeof pageNumber === 'number') {
      const pageNumberCustom = pageNumber + 1;
      setPage(pageNumberCustom);
      if (syncWithParams) {
        searchParams.set('page', pageNumberCustom.toString());
        searchParams.set('take', take.toString());
        setSearchParams(searchParams);
      }
    }
  };

  const prevParam = usePrevious(searchParams);
  const getPageParam = searchParams.get('page');
  const getTakeParam = searchParams.get('take');
  const existingParams = Object.fromEntries(searchParams);

  useEffect(() => {
    if (syncWithParams) {
      searchParams.set('page', getPageParam ?? page.toString());
      searchParams.set('take', getTakeParam ?? take.toString());
      setSearchParams({ ...searchParams, ...existingParams });
    }
  }, []);

  /**
   * @description If the current page is zero then set the page default with the meta
   * & the existing search params
   */
  useEffect(() => {
    if (pageIndex <= 0) {
      setPage(getPageParam ? Number(getPageParam) : page);
      searchParams.set('page', getPageParam ?? page.toString());
      searchParams.set('take', getTakeParam ?? take.toString());
      setSearchParams({ ...searchParams, ...existingParams });
    }
  }, [pageIndex, pageCount]);

  useEffect(() => {
    if (pageIndex > pageCount) {
      setPage(pageCount);
      searchParams.set('page', pageCount.toString());
      searchParams.set('take', getTakeParam ?? take.toString());
      setSearchParams({ ...searchParams, ...existingParams });
    }
  }, [pageIndex, pageCount]);

  useEffect(() => {
    if (!syncWithParams) return;

    if (!isEqual(prevParam, searchParams)) {
      setPage(getPageParam ? Number(getPageParam) : page);
      setLimit(getTakeParam ? Number(getTakeParam) : take);
    }
  }, [searchParams]);
  useEffect(() => {
    if (pageSize > 10 && pageIndex > 1) {
      setPage(1);
      if (syncWithParams) {
        searchParams.set('page', '1');
        setSearchParams(searchParams);
      }
    }
  }, [pageSize]);

  const handleClickPreviousPagination = () => {
    const pageNumberCustom = page - 1;
    setPage((prev) => prev - 1);
    if (syncWithParams) {
      searchParams.set('page', pageNumberCustom.toString());
      searchParams.set('take', take.toString());
      setSearchParams(searchParams);
    }
  };
  const handleClickNextPagination = () => {
    const pageNumberCustom = page + 1;
    setPage((prev) => prev + 1);
    if (syncWithParams) {
      searchParams.set('page', pageNumberCustom.toString());
      searchParams.set('take', take.toString());
      setSearchParams(searchParams);
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
          <Fragment>
            <PaginationItem>
              <PaginationLink
                className={cn(
                  'border-2 border-solid border-rs-v2-thunder-blue text-white',
                  'cursor-pointer bg-rs-v2-slate-blue-60%',
                  isPageBelowZero && 'cursor-default text-slate-500',
                )}
                isActive={!isPageBelowZero}
                onClick={() => {
                  if (!isPageBelowZero) {
                    handleClickPreviousPagination();
                  }
                }}
              >
                <MdChevronLeft size={18} />
              </PaginationLink>
            </PaginationItem>
            <Fragment>{renderPagination()}</Fragment>
            <PaginationItem>
              <PaginationLink
                isActive={isPageBelowPageCount}
                className={cn(
                  'border-2 border-solid border-rs-v2-thunder-blue text-white',
                  'cursor-pointer bg-rs-v2-slate-blue-60%',
                  !isPageBelowPageCount && 'cursor-default text-slate-500',
                )}
                onClick={() => {
                  if (isPageBelowPageCount) {
                    handleClickNextPagination();
                  }
                }}
              >
                <MdChevronRight size={18} />
              </PaginationLink>
            </PaginationItem>
          </Fragment>
        </PaginationContent>
      </Pagination>
      {isPageCountMoreThanOne ? (
        <Fragment>
          <div className="inline-block">
            <Select
              value={`${pageSize}`}
              onValueChange={(value: string) => {
                setLimit(Number(value));
                if (syncWithParams) {
                  setSearchParams({
                    ...existingParams,
                    page: page.toString(),
                    take: value,
                  });
                }
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

export default TableBackendPagination;
