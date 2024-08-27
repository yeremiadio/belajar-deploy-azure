import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import SelectComponent from '@/components/Select';
import InputDatePickerComponent from '@/components/InputDatePickerComponent';
import Modal from '@/components/Modal';

import { useModal } from '@/utils/hooks/useModal';
import useModuleOpts from '@/utils/hooks/selectOptions/useModuleOptions';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

import { cn } from '@/lib/utils';

import {
  EAlertConfirmed,
  EAlertStatus,
  EAvailableAdditionalFilterReport,
  EReportData,
} from '@/types/api/report';

import { useGetDevicesQuery } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { useGetSensorV2Query } from '@/stores/managementStore/sensorStore/sensorStoreApi';

import ReportTable from '../ReportTable';
import AddFilterButton from '../AddFilterButton';
import AdditionalFilterForm, {
  TAdditionalFilterForm,
} from '../AdditionalFilterForm';
import FilterComboboxDropdown from '../FilterComboboxDropdown';

type Props = {};

const ReportContent: FC<Props> = () => {
  const customSelectStyles =
    'relative h-fit [&_.rc-select-selection-placeholder]:!text-white [&_.rc-select-selector]:!min-h-0 [&_.rc-select-selector]:!py-[5px] [&_.rc-select-selector]:!ps-[15px] [&_.rc-select-selector]:!bg-rs-v2-navy-blue-60% [&_.rc-select-selector]:!border [&_.rc-select-selector]:!border-rs-v2-light-grey [&_.rc-select-selector]:hover:!border-rs-v2-mint [&_.rc-select-selector]:!pe-[35px] [&_.rc-select-selection-placeholder]:!top-[5.5px] [&_.rc-select-selection-item]:!top-[5.5px] [&_.rc-select-arrow]:py-0 [&_.rc-select-arrow]:pt-[5px] [&_.rc-select-arrow]:px-0 [&_.rc-select-arrow]:pe-[8px]';

  const { isShown: isShownAdditionalFilter, toggle: toggleAdditionalFilter } =
    useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const moduleParams = searchParams.get('module');
  const dataParams = searchParams.get('data');
  const dateParams = searchParams.get('date');

  const [selectedModule, setSelectedModule] = useState<number>();
  const [selectedData, setSelectedData] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [additionalFilter, setAdditionalFilter] =
    useState<TAdditionalFilterForm>({
      filters: [],
    });

  useEffect(() => {
    setSelectedModule(moduleParams ? parseInt(moduleParams) : undefined);
    setSelectedData(dataParams || undefined);
    setSelectedDate(dateParams ? new Date(dateParams) : undefined);
  }, []);

  useEffect(() => {
    if (!selectedModule || !selectedData || !selectedDate) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('module', selectedModule?.toString() || '');
    newSearchParams.set('data', selectedData || '');
    newSearchParams.set('date', selectedDate?.toISOString() || '');

    setSearchParams(newSearchParams);
  }, [selectedModule, selectedData, selectedDate]);

  const { data: deviceList } = useGetDevicesQuery(
    {
      moduleId: selectedModule,
    },
    {
      skip: !selectedModule || !selectedData || !selectedDate,
    },
  );

  const { data: sensorList } = useGetSensorV2Query(
    {
      isPaginated: false,
      moduleId: selectedModule,
    },
    {
      skip: !selectedModule || !selectedData || !selectedDate,
    },
  );

  // Options
  const { arr: moduleOptions, isLoading: loadingModuleOptions } = useModuleOpts(
    {
      filterByPermission: true,
    },
  );

  const deviceListOptions = deviceList
    ? deviceList?.entities?.map((device) => ({
        label: device.name,
        value: device.id.toString(),
      }))
    : [];

  const sensorListOptions = sensorList
    ? sensorList?.entities?.map((sensor) => ({
        label: sensor.name,
        value: sensor.id.toString(),
      }))
    : [];

  const reportDataOptions = Object.keys(EReportData).map((key) => ({
    label: EReportData[key as keyof typeof EReportData],
    value: key,
  }));

  const filterTypeOptions = Object.keys(EAvailableAdditionalFilterReport).map(
    (key) => ({
      label:
        EAvailableAdditionalFilterReport[
          key as keyof typeof EAvailableAdditionalFilterReport
        ],
      value: key,
    }),
  );

  const alertStatusOptions = Object.keys(EAlertStatus).map((key) => ({
    label: EAlertStatus[key as keyof typeof EAlertStatus],
    value: key,
  }));

  const alertConfirmedOptions = Object.keys(EAlertConfirmed).map((key) => ({
    label: EAlertConfirmed[key as keyof typeof EAlertConfirmed],
    value: key,
  }));

  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const hideTable = !selectedModule || !selectedData || !selectedDate;

  const resetAdditionalFilter = () => {
    setAdditionalFilter({
      filters: [],
    });
  };

  const renderContent = (children: React.ReactNode) => {
    if (isMobile) {
      return (
        <OverlayScrollbarsComponent
          className="h-full w-full"
          options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
          defer
        >
          {children}
        </OverlayScrollbarsComponent>
      );
    } else {
      return children;
    }
  };

  const handleChangeModule = (value: number) => {
    setSelectedModule(value);
    resetAdditionalFilter();
    setSelectedData(undefined);
    setSelectedDate(undefined);
  };

  const handleChangeAdditionalFilter = (
    value?: string[],
    filter?: {
      filterType: string;
      filterValue: string[];
    },
  ) => {
    if (!value || !filter) return;

    setAdditionalFilter((prev) => {
      const newFilters = prev.filters.map((item) => {
        if (item.filterType === filter.filterType) {
          return {
            ...item,
            filterValue: value,
          };
        }

        return item;
      });

      return {
        filters: newFilters,
      };
    });
  };

  const getLabelAdditionalFilter = (filter: {
    filterType: string;
    filterValue: string[];
  }) => {
    const selectedLabel = filter.filterValue
      ?.map((item) => {
        return filter.filterType === 'deviceIds'
          ? deviceListOptions?.find((option) => option.value === item)?.label
          : filter.filterType === 'threatLevels'
            ? alertStatusOptions?.find((option) => option.value === item)?.label
            : filter.filterType === 'alertConfirmed'
              ? alertConfirmedOptions?.find((option) => option.value === item)
                  ?.label
              : filter.filterType === 'sensorTypeIds'
                ? sensorListOptions?.find((option) => option.value === item)
                    ?.label
                : '';
      })
      .join(', ');

    return selectedLabel;
  };

  const getAdditionalFilterOptions = (filterType: string) => {
    switch (filterType as keyof typeof EAvailableAdditionalFilterReport) {
      case 'deviceIds':
        return deviceListOptions;
      case 'sensorTypeIds':
        return sensorListOptions;
      case 'threatLevels':
        return alertStatusOptions;
      case 'alertConfirmed':
        return alertConfirmedOptions;
      default:
        return [];
    }
  };

  const selectedModuleData = moduleOptions.find(
    (module) => module.id === selectedModule,
  );

  // screentype
  const needAlertConfirmedColumn = [
    'forestfire',
    'flood',
    'smartpole',
    'machinemonitoring',
  ];

  const showAlertConfirmed = selectedModuleData?.permissions?.dashboard?.some(
    (permission) => needAlertConfirmedColumn.includes(permission.name),
  );

  return (
    <>
      <div className="relative w-full">
        {/* Filter */}
        <div className="relative z-10 mb-6 grid grid-cols-10 gap-2.5 rounded-md border border-rs-v2-thunder-blue bg-rs-v2-navy-blue px-3 py-1.5 backdrop-blur-[15px]">
          {/* Main Filter */}
          <div className="col-span-10 flex min-w-[35%] gap-2 lg:col-span-4">
            <SelectComponent
              placeholder="Modul:"
              popupContainer="body"
              value={selectedModule}
              onChange={(value) => handleChangeModule(value)}
              containerClassName={customSelectStyles}
              options={moduleOptions}
              loading={loadingModuleOptions}
            />
            <SelectComponent
              placeholder="Data:"
              value={selectedData}
              popupContainer="body"
              onChange={(value) => setSelectedData(value)}
              containerClassName={customSelectStyles}
              options={reportDataOptions}
            />
            <InputDatePickerComponent
              onChange={(value) => value && setSelectedDate(value)}
              placeholder="Date:"
              value={selectedDate}
              className="h-[30px] min-h-[30px] border-rs-v2-light-grey bg-rs-v2-navy-blue-60% !placeholder-white"
              containerClassName="h-fit"
            />
          </div>
          {/* Additional Filter */}
          <div className="col-span-10 flex flex-grow gap-2 lg:col-span-6">
            {additionalFilter?.filters?.length > 0 &&
              renderContent(
                <div
                  className={cn(
                    'flex gap-2 border-s-rs-v2-thunder-blue md:flex-wrap lg:border-s lg:ps-2.5',
                  )}
                >
                  {additionalFilter?.filters?.map((filter, index) => {
                    const selectedLabel = getLabelAdditionalFilter(filter);
                    const options = getAdditionalFilterOptions(
                      filter.filterType,
                    );
                    const filterType =
                      EAvailableAdditionalFilterReport[
                        filter.filterType as keyof typeof EAvailableAdditionalFilterReport
                      ];

                    const title = `${filterType}: ${selectedLabel}`;

                    const useSingleSelect =
                      filter.filterType === 'alertConfirmed';

                    return (
                      <FilterComboboxDropdown
                        key={index}
                        singleSelect={useSingleSelect}
                        title={title}
                        useDrawerOnSmallScreen={isMobile}
                        clearAction={() => {
                          setAdditionalFilter((prev) => {
                            const newFilters = prev.filters.filter(
                              (item) => item.filterType !== filter.filterType,
                            );

                            return {
                              filters: newFilters,
                            };
                          });
                        }}
                        selectedOption={
                          typeof filter.filterValue === 'string'
                            ? [filter.filterValue]
                            : filter.filterValue
                        }
                        onChange={(value) => {
                          handleChangeAdditionalFilter(value, filter);
                        }}
                        useCombobox={false}
                        additionalDrawerTitle={filterType}
                        options={options}
                        withSelectAll
                      />
                    );
                  })}
                </div>,
              )}
            <div className="flex gap-2">
              <AddFilterButton
                filterCount={additionalFilter?.filters?.length || 0}
                onClick={() => toggleAdditionalFilter(true)}
                disabled={hideTable}
              />
              <button
                type="button"
                disabled={hideTable}
                className={cn(
                  'h-[30px] rounded-md bg-rs-v2-slate-blue-60% px-3 text-sm',
                  hideTable && 'opacity-70',
                )}
                onClick={resetAdditionalFilter}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        {!hideTable && (
          <ReportTable
            selectedModule={selectedModule}
            selectedData={selectedData}
            selectedDate={selectedDate}
            additionalFilter={additionalFilter}
            showAlertConfirmed={showAlertConfirmed}
          />
        )}
      </div>

      <Modal
        title="Additional Filters"
        toggle={toggleAdditionalFilter}
        isShown={isShownAdditionalFilter}
        minWidth="min-w-[550px]"
      >
        <AdditionalFilterForm
          toggle={toggleAdditionalFilter}
          setFilter={setAdditionalFilter}
          activeFilter={additionalFilter}
          filterTypeOptions={filterTypeOptions}
          deviceListOptions={deviceListOptions}
          alertStatusOptions={alertStatusOptions}
          alertConfirmedOptions={alertConfirmedOptions}
          sensorListOptions={sensorListOptions}
          showAlertConfirmed={showAlertConfirmed}
        />
      </Modal>
    </>
  );
};

export default ReportContent;
