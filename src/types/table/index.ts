import { ColumnDef, Row } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';

import { CustomPaginationProps } from '@/components/Table/BaseTable/_components/TableBackendPagination';

import { Meta } from '@/types/api';
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFullWidth?: boolean;
  isShowNumbering?: boolean;
  backendPagination?: React.ReactElement<CustomPaginationProps>;
  isShowPagination?: boolean;
  isDefaultExpanded?: boolean;
  renderExpansion?: (row: Row<TData>) => JSX.Element;
  isShowExpansionTable?: boolean;
  onExportButton?: boolean;
  exportName?: string;
  exportParams?: URLSearchParams;
  exportText?: string;
  onSearchInput?: boolean;
  withToolbar?: boolean;
  isLoading?: boolean;
  additionalPrefixToolbarElement?: JSX.Element;
  additionalSuffixToolbarElement?: JSX.Element;
  meta?: Meta;
  hideColumns?: string[];
  searchInputValue?: string;
  onSearchInputChange?: Dispatch<SetStateAction<string>>;
  onRowClick?: (row: Row<TData>) => void;
  hidePagination?: boolean;
  selectedRows?: Row<TData>[];
  setSelectedRows?: Dispatch<SetStateAction<Row<TData>[]>>;
  quickAccessToolbarChildren?: JSX.Element;
  name?: string;
  noDataText?: string;
  inlineSearchWithPrefix?: boolean;
}
