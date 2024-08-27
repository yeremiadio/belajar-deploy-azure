import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { TReportLogResponse } from '@/types/api/report';

import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';

import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';

import { useGetReportLogQuery } from '@/stores/reportStore/reportStoreApi';

import { TAdditionalFilterForm } from '@/pages/Report/_components/AdditionalFilterForm';

type Props = {
  selectedModule: number;
  selectedData: string;
  selectedDate: Date;
  additionalFilter: TAdditionalFilterForm;
  showAlertConfirmed?: boolean;
};

const LogTable: FC<Props> = ({
  selectedModule,
  selectedData,
  selectedDate,
  additionalFilter,
  showAlertConfirmed,
}) => {
  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  useEffect(() => {
    setPage(1);
    setLimit(10);
  }, [selectedModule, selectedData, selectedDate, additionalFilter]);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchDebounce = useDebounce(searchValue, 500);

  const threatLevels = additionalFilter?.filters?.find((filter) => {
    return filter.filterType === 'threatLevels';
  })?.filterValue;
  const deviceIds = additionalFilter?.filters?.find((filter) => {
    return filter.filterType === 'deviceIds';
  })?.filterValue;
  const sensorTypeIds = additionalFilter?.filters?.find((filter) => {
    return filter.filterType === 'sensorTypeIds';
  })?.filterValue;
  const isAlertConfirmed = additionalFilter?.filters?.find((filter) => {
    return filter.filterType === 'alertConfirmed';
  })?.filterValue[0];

  const shapeParamsExportCSV = () => {
    const params = new URLSearchParams();

    if (deviceIds) {
      deviceIds.forEach((id) => params.append('deviceIds', id.toString()));
    }
    if (sensorTypeIds) {
      sensorTypeIds.forEach((id) =>
        params.append('sensorTypeIds', id.toString()),
      );
    }
    if (threatLevels) {
      threatLevels.forEach((level) =>
        params.append('threatLevels', level.toString()),
      );
    }
    if (isAlertConfirmed !== undefined) {
      params.append('isAlertConfirmed', isAlertConfirmed.toString());
    }

    params.append('date', selectedDate.toISOString());
    params.append('page', page ? page.toString() : '1');
    params.append('take', take ? take.toString() : '10');
    params.append('search', searchDebounce);

    return params;
  };

  const { data, isLoading } = useGetReportLogQuery({
    date: selectedDate.toISOString(),
    moduleId: selectedModule,
    dataType: selectedData,
    threatLevels: threatLevels,
    deviceIds: deviceIds,
    sensorTypeIds: sensorTypeIds,
    isAlertConfirmed: isAlertConfirmed,
    page: page <= 0 ? 1 : page,
    take,
    search: searchDebounce,
  });

  const columns: ColumnDef<TReportLogResponse>[] = [
    {
      header: 'Timestamp',
      accessorFn: (row) =>
        row.timestamp ? dayjs(row?.timestamp).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      header: 'Device ID',
      accessorFn: (row) => row?.device_id || '-',
    },
    {
      header: 'Location',
      accessorFn: (row) => row?.location_name || '-',
    },
    {
      header: 'Sensor Type',
      accessorFn: (row) => row?.sensor_type || '-',
    },
    {
      header: 'Sensor Value',
      accessorFn: (row) => (row?.value ? `${row?.value} ${row?.unit}` : '-'),
    },
    {
      header: 'Alert Status',
      cell: ({ row: { original } }) => {
        switch (original?.threatlevel) {
          case 1:
            return (
              <p className="w-fit rounded-xl bg-rs-alert-yellow/30 px-3 py-[2px] text-rs-alert-yellow">
                Warning
              </p>
            );
          case 2:
            return (
              <p className="w-fit rounded-xl bg-rs-alert-danger/30 px-3 py-[2px] text-rs-alert-danger">
                Critical
              </p>
            );
          default:
            return (
              <p className="w-fit rounded-xl bg-rs-alert-green-30% px-3 py-[2px] text-rs-alert-green">
                Normal
              </p>
            );
        }
      },
    },
  ];

  /**
   * Add column alert confirmed for this dashboard
   * - ews forest --> forestfire
   * - flood --> flood
   * - smartpole --> smartpole
   * - machine --> machinemonitoring
   */

  if (showAlertConfirmed && isAlertConfirmed === 'true') {
    columns.push({
      header: 'Alert Confirmed',
      accessorFn: (row) => (row?.is_confirmed ? 'Yes' : 'No'),
    });
  }

  return (
    <BaseTable
      columns={columns}
      data={data?.entities ?? []}
      withToolbar
      onSearchInput
      onExportButton
      isLoading={isLoading}
      searchInputValue={searchValue}
      onSearchInputChange={setSearchValue}
      isShowPagination
      exportName={`report/${selectedModule}/${selectedData}`}
      exportParams={shapeParamsExportCSV()}
      meta={data?.meta}
      backendPagination={
        data?.meta && (
          <div className="px-3 pb-3">
            <TableBackendPagination
              page={page}
              take={take}
              meta={data.meta}
              setLimit={setLimit}
              setPage={setPage}
              // syncWithParams={false}
            />
          </div>
        )
      }
    />
  );
};

export default LogTable;
