import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline, MdOutlineLinkOff } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import DropdownComponent from '@/components/Dropdown';
import Modal from '@/components/Modal';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { ExpansionTable } from '@/components/Table/ExpansionTable';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import GroupTableButton from '@/components/Wrapper/ButtonWrapper/GroupTableButton';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteDeviceMutation,
  useGetDevicesQuery,
} from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { useDeleteDeviceSensorRelationMutation } from '@/stores/managementStore/deviceStore/deviceSensorStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IDeviceDetailSublocationMachineWithMap,
  IDeviceSensorRelation,
} from '@/types/api/management/device';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useModal } from '@/utils/hooks/useModal';

import BindAccountForm from './_components/BindAccountForm';
import DataDeliverySlideForm from './_components/DataDeliverySlideForm';
import DeviceForm from './_components/DeviceForm';
import GenerateQRCode from './_components/GenerateQR';
import SensorForm from './_components/SensorForm';

const DeviceManagementPage = () => {
  const htmlId = 'managementDeviceId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toast } = useToast();
  const userType = useUserType();

  // options
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts({ isPaginated: false });

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchNameParams = searchParams.get('name');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    selectedCompanyIdParams ? Number(selectedCompanyIdParams) : null,
  );
  const [searchName, setSearchName] = useState<string>(searchNameParams ?? '');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  useEffect(() => {
    if (debouncedSearchName && debouncedSearchName.length > 1) {
      searchParams.set('name', debouncedSearchName);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('name');
    }
    setSearchParams(searchParams);
  }, [debouncedSearchName]);

  useEffect(() => {
    if (selectedCompanyId) {
      searchParams.set('companyId', selectedCompanyId.toString());
      searchParams.set('page', '1');
    } else {
      searchParams.delete('companyId');
    }
    setSearchParams(searchParams);
  }, [selectedCompanyId]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    name: debouncedSearchName,
    companyId: selectedCompanyId ?? undefined,
  });

  const {
    data: dataDevices,
    isLoading,
    isFetching,
  } = useGetDevicesQuery(activeFilter);
  const loading = isLoading || isFetching;

  const {
    isShown: isShownAdjustDataDelivery,
    toggle: toggleAdjustDataDelivery,
  } = useModal();
  const { isShown: isShownAddDevice, toggle: toggleAddDevice } = useModal();
  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimensions(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  const devicesMemo = useMemo<IDeviceDetailSublocationMachineWithMap[]>(() => {
    if (!dataDevices) return [];
    const deviceList = dataDevices.entities.slice();
    return deviceList;
  }, [dataDevices]);

  const dataDevicesMeta = useMemo(() => {
    return dataDevices?.meta;
  }, [dataDevices]);

  const [pageExpansion, setPageExpansion] = useState<number>(1);
  const [takeExpansion, setTakeExpansion] = useState<number>(10);

  const deviceSensorColumns: ColumnDef<IDeviceSensorRelation>[] = [
    {
      header: 'No',
      cell: ({ row: { index } }) => {
        return index + 1 + (pageExpansion - 1) * takeExpansion;
      },
      maxSize: 50,
    },
    {
      header: 'Sensor',
      accessorKey: 'sensor',
      id: 'sensorName',
      cell: ({ row: { original } }) => {
        return original.sensor ? original.sensor.name : '-';
      },
      maxSize: 50,
    },
    {
      header: 'Sensor Code',
      accessorKey: 'sensor',
      id: 'sensorCode',
      cell: ({ row: { original } }) => {
        return original.sensor ? original.sensor.code : '-';
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const { toggle: toggleUnbindSensor, isShown: isShownUnbindSensor } =
          useModal();
        const [unbindSensor, { isLoading }] =
          useDeleteDeviceSensorRelationMutation();
        const handleUnbindSensor = async () => {
          await unbindSensor({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Sensor unbinded successfully',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
            });
        };

        return (
          <DivPropagationWrapper>
            <Modal
              title="Unbind Sensor"
              toggle={toggleUnbindSensor}
              isShown={isShownUnbindSensor}
              description={`Unbinding "${data.sensor.name}" from the Device "${
                devicesMemo.find((d) => d.id === data.deviceId)?.name
              }" will detach the sensor and have consequences to this device.`}
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleUnbindSensor}
                    disabled={isLoading}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    {isLoading ? (
                      <Spinner
                        size={18}
                        borderWidth={1.5}
                        isFullWidthAndHeight
                      />
                    ) : (
                      'Unbind'
                    )}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Modal>
            <Button
              onClick={() => toggleUnbindSensor()}
              className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
            >
              <MdOutlineLinkOff size={24} />
            </Button>
          </DivPropagationWrapper>
        );
      },
      maxSize: 10,
    },
  ];

  // Filter out the Action column if userType is true
  const filteredDeviceSensorColumns =
    userType === 'superadmin'
      ? deviceSensorColumns.filter((column) => column.header !== 'Action')
      : deviceSensorColumns;

  const columns: ColumnDef<IDeviceDetailSublocationMachineWithMap>[] = [
    {
      accessorKey: 'name',
      header: 'Device Name',
    },
    {
      accessorKey: 'devicetype',
      header: 'Device Type',
      cell: ({ row: { original } }) => original.devicetype?.name,
    },
    {
      accessorKey: 'company',
      id: 'company',
      header: 'Company',
      cell: ({ row: { original } }) => original.company?.name,
    },
    {
      accessorKey: 'location',
      id: 'location',
      header: 'Location',
      cell: ({ row: { original } }) => original.location?.name,
    },
    {
      accessorKey: 'gateway',
      id: 'subLocation1',
      header: 'Sub Location 1',
      cell: ({ row: { original } }) =>
        original.gateway?.sublocation2?.sublocation1?.name,
    },
    {
      accessorKey: 'gateway',
      id: 'subLocation2',
      header: 'Sub Location 2',
      cell: ({ row: { original } }) => original.gateway?.sublocation2?.name,
    },
    {
      header: 'Gateway',
      accessorKey: 'gateway',
      cell: ({ row: { original } }) => {
        return original.gateway?.name;
      },
    },
    {
      header: 'Account',
      accessorKey: 'users',
      cell: ({ row: { original } }) => {
        const { users } = original;
        return (
          <div className="flex flex-wrap items-center gap-1">
            {users.length > 0 ? (
              <GroupTableButton
                groups={users.map((item) => {
                  const { id, firstname, lastname } = item;
                  return {
                    id,
                    name: `${firstname} ${lastname}`,
                  };
                })}
              />
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const [deleteDevice] = useDeleteDeviceMutation();
        const isEditing = original.users.length ? true : false;
        const { isShown: isShownQR, toggle: toggleQR } = useModal();
        const { isShown: isShownEdit, toggle: toggleEdit } = useModal();
        const { isShown: isShownAdd, toggle: toggleAdd } = useModal();
        const { isShown: isShownDelete, toggle: toggleDelete } = useModal();
        const { isShown: isShownBindAccount, toggle: toggleBindAccount } =
          useModal();
        let actionsDropdown = [
          { label: 'Add Sensor', onClick: () => toggleAdd() },
          { label: 'Edit Device', onClick: () => toggleEdit() },
          { label: 'Generate QR', onClick: () => toggleQR() },
          { label: 'Bind Account', onClick: () => toggleBindAccount() },
        ];

        if (userType !== 'systemadmin') {
          actionsDropdown = actionsDropdown.filter(
            (action) => action.label !== 'Add Sensor',
          );
        }

        const handleDeleteDevice = async () => {
          await deleteDevice({ id: original.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Success deleting device ${original.name}`,
                  variant: 'success',
                }),
              );
              toggleDelete();
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              const { title, message } = generateStatusCodesMessage(
                error.status,
              );
              toast(
                generateDynamicToastMessage({
                  title,
                  description: `${message} "\n${error?.data?.message ?? ''}"`,
                  variant: 'error',
                }),
              );
              toggleDelete();
            });
        };

        return (
          <DivPropagationWrapper>
            <div className="inline-flex">
              <DropdownComponent
                menuItems={actionsDropdown}
                placeholder="Action"
              />
              {userType === 'systemadmin' && (
                <Button
                  onClick={() => toggleDelete()}
                  className="bg-transparent p-[5px] text-rs-v2-red hover:bg-transparent hover:text-rs-v2-red hover:opacity-50"
                >
                  <MdDeleteOutline size={24} />
                </Button>
              )}
            </div>
            <Modal
              title="Delete Device"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description="Apakah yakin ingin menghapus device ini?"
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDeleteDevice}
                  >
                    Delete Device
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Modal>
            <Modal title="Add Sensor" toggle={toggleAdd} isShown={isShownAdd}>
              <SensorForm toggle={toggleAdd} id={original.id} data={original} />
            </Modal>
            <Modal
              title="Edit Device"
              toggle={toggleEdit}
              isShown={isShownEdit}
            >
              <DeviceForm
                id={original.id}
                data={original}
                toggle={toggleEdit}
              />
            </Modal>
            <Modal title="Generate QR" toggle={toggleQR} isShown={isShownQR}>
              <GenerateQRCode qrValue="2435-28" />
            </Modal>
            <Modal
              title="Binding Account"
              toggle={toggleBindAccount}
              isShown={isShownBindAccount}
            >
              <BindAccountForm
                id={original.id}
                data={original}
                toggle={toggleBindAccount}
                isEditing={isEditing}
              />
            </Modal>
          </DivPropagationWrapper>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <TopBar
        title="Management Device"
        isFloating={false}
        topBarRef={topElementRef}
      />

      <ContentWrapper id={htmlId}>
        {isShownAddDevice && (
          <Modal
            title="Add Device"
            toggle={toggleAddDevice}
            isShown={isShownAddDevice}
          >
            <DeviceForm toggle={toggleAddDevice} />
          </Modal>
        )}
        <Modal
          title="Interval Data Delivery"
          toggle={toggleAdjustDataDelivery}
          isShown={isShownAdjustDataDelivery}
        >
          <DataDeliverySlideForm toggle={toggleAdjustDataDelivery} />
        </Modal>
        <div
          className="relative w-full overflow-auto p-1"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
          <BaseTable
            data={devicesMemo}
            onExportButton
            exportName="device"
            onSearchInput
            onSearchInputChange={setSearchName}
            searchInputValue={searchName}
            withToolbar
            meta={dataDevicesMeta}
            isLoading={loading}
            backendPagination={
              dataDevicesMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataDevicesMeta}
                  setLimit={setLimit}
                />
              )
            }
            additionalPrefixToolbarElement={
              userType === 'systemadmin' ? (
                <SelectComponent
                  allowClear
                  options={companyOptions}
                  value={selectedCompanyId}
                  containerClassName="w-fit"
                  className="rc-select--navy-blue"
                  placeholder="Search Company..."
                  loading={isLoadingCompanyOptions}
                  labelRender={({ label }) => (
                    <p className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                      {label}
                    </p>
                  )}
                  onChange={(value) => setSelectedCompanyId(value)}
                />
              ) : (
                <></>
              )
            }
            additionalSuffixToolbarElement={
              userType === 'systemadmin' ? (
                <Button
                  className="btn-primary-mint hover:hover-btn-primary-mint"
                  onClick={() => toggleAddDevice()}
                >
                  Add Device <AiOutlinePlus className="ml-2" />
                </Button>
              ) : (
                <Button
                  className="btn-primary-mint hover:hover-btn-primary-mint"
                  onClick={() => toggleAdjustDataDelivery()}
                >
                  Adjust Interval Data Delivery
                </Button>
              )
            }
            renderExpansion={(
              row: Row<IDeviceDetailSublocationMachineWithMap>,
            ) => {
              const currentDeviceSensor = devicesMemo.find(
                (d) => d.id === row.original.id,
              );

              const expansionDataTable =
                currentDeviceSensor?.devicesensorrelation?.slice(
                  (pageExpansion - 1) * takeExpansion,
                  takeExpansion * pageExpansion,
                );

              const metaExpansion = {
                page: pageExpansion,
                offset: takeExpansion,
                itemCount: (currentDeviceSensor?.devicesensorrelation || [])
                  .length,
                pageCount: Math.ceil(
                  (currentDeviceSensor?.devicesensorrelation || []).length /
                    takeExpansion,
                ),
              };

              return isLoading ? (
                <Spinner
                  size={24}
                  isFullWidthAndHeight={false}
                  borderWidth={2.5}
                  containerClassName="p-2"
                />
              ) : (
                <ExpansionTable
                  data={expansionDataTable || []}
                  columns={filteredDeviceSensorColumns}
                  backendPagination={
                    (currentDeviceSensor?.devicesensorrelation || []).length >
                    10 ? (
                      <div className="px-3 pb-3">
                        <TableBackendPagination
                          page={pageExpansion}
                          take={takeExpansion}
                          meta={metaExpansion}
                          setLimit={setTakeExpansion}
                          setPage={setPageExpansion}
                          syncWithParams={false}
                        />
                      </div>
                    ) : (
                      <></>
                    )
                  }
                  isFullWidth
                />
              );
            }}
            columns={columns}
            isFullWidth
            hideColumns={userType !== 'systemadmin' ? ['company'] : []}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DeviceManagementPage;
