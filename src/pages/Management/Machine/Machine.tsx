import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline, MdRefresh } from 'react-icons/md';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import DropdownComponent from '@/components/Dropdown';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import GroupTableButton from '@/components/Wrapper/ButtonWrapper/GroupTableButton';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteBindDeviceMachineMutation,
  useDeleteMachineMutation,
  useGetmachineGroupListQuery,
  useGetMachineQuery,
} from '@/stores/managementStore/machineStore/machineStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IMachine } from '@/types/api/management/machine';
import { BasicSelectOpt } from '@/types/global';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import { ColumnDef, Row } from '@tanstack/react-table';

import BindRecipeForm from './_components/BindRecipeForm';
import DropdownMachineGroup from './_components/DropdownMachineGroup';
import GenerateQR from './_components/GenerateQR/GenerateQR';
import MachineBindRecipeExpansionTable from './_components/MachineBindRecipeExpansionTable';
import MachineForm from './_components/MachineForm';
import ManageMachineGroupForm from './_components/ManageMachineGroup';
import NewMachineGroupForm from './_components/NewMachineGroup';
import { useSearchParams } from 'react-router-dom';
import BindDeviceForm from './_components/BindDeviceMachineForm';

const MachinePage = () => {
  const htmlId = 'managementMachineId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const [selectedRows, setSelectedRows] = useState<Row<IMachine>[]>([]);
  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const { toggle: toggleAddGroup, isShown: isShownAddGroup } = useModal();
  const { toggle: toggleManageGroup, isShown: isShownManageGroup } = useModal();

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchMachineParams = searchParams.get('search');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchMachineParams ?? '',
  );
  const debouncedSearch = useDebounce(inputSearch, 1500);

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  // re-assigns params
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      searchParams.set('search', debouncedSearch);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearch,
  });

  const {
    data: machineData,
    isLoading,
    isFetching,
  } = useGetMachineQuery(activeFilter);

  const { data: machineGroupData } = useGetmachineGroupListQuery({
    isShow: true,
  });
  const loading = isLoading || isFetching;

  const machineGroupDataMemo = useMemo<BasicSelectOpt<number>[]>(() => {
    if (!machineGroupData || !machineGroupData) return [];
    const list = machineGroupData.slice();
    const sanitizedData = list.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    return sanitizedData;
  }, [machineGroupData]);

  const machineDataMemo = useMemo<IMachine[]>(() => {
    if (!machineData || !machineData.entities) return [];
    const list = machineData.entities.slice();

    return list;
  }, [machineData]);

  const dataMeta = useMemo(() => {
    return machineData?.meta;
  }, [machineData]);

  const machineColumns: ColumnDef<IMachine>[] = [
    {
      accessorKey: 'code',
      header: 'Machine ID',
    },
    {
      accessorKey: 'name',
      header: 'Machine Name',
    },
    {
      accessorKey: 'location.name',
      header: 'Location',
    },
    {
      accessorKey: 'machineGroups',
      header: 'Group',
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap items-center gap-1">
            <GroupTableButton groups={row.original.machineGroups} />
          </div>
        );
      },
    },
    {
      accessorKey: 'device.name',
      header: 'Device',
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row }) => {
        const data = row.original;
        const isEditing = data.device ? true : false;
        const [deleteMachine] = useDeleteMachineMutation();
        const [unbindDevice] = useDeleteBindDeviceMachineMutation();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: toggleBindRecipe, isShown: isShownBindRecipe } =
          useModal();
        const { toggle: toggleBindDevice, isShown: isShownBindDevice } =
          useModal();
        const { toggle: toggleUnBindDevice, isShown: isShownUnBindDevice } =
          useModal();
        const { toggle: toggleGenerateQr, isShown: isShownGenerateQr } =
          useModal();
        const actionsDropdown = [
          { label: 'Edit Machine', onClick: () => toggleEdit() },
          { label: 'Bind Recipe', onClick: () => toggleBindRecipe() },
          { label: 'Bind Device', onClick: () => toggleBindDevice() },
          { label: 'Generate QR', onClick: () => toggleGenerateQr() },
        ];

        const handleDelete = async () => {
          await deleteMachine({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Success deleting machine ${data.name}`,
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

        const handleUnBindDevice = async () => {
          await unbindDevice({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Success unbind device machine ${data.device.name}`,
                  variant: 'success',
                }),
              );
              toggleUnBindDevice();
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
              toggleUnBindDevice();
            });
        };

        return (
          <DivPropagationWrapper className="flex flex-wrap items-center gap-2">
            <Modal
              title="Edit Machine"
              toggle={toggleEdit}
              isShown={isShownEdit}
            >
              <MachineForm data={data} isEditing toggle={toggleEdit} />
            </Modal>
            <Modal
              title="Binding Recipe"
              toggle={toggleBindRecipe}
              isShown={isShownBindRecipe}
            >
              <BindRecipeForm data={data} toggle={toggleBindRecipe} />
            </Modal>
            <Modal
              title={isEditing ? 'Change Device' : 'Binding Device'}
              toggle={toggleBindDevice}
              isShown={isShownBindDevice}
            >
              <BindDeviceForm
                data={data}
                isEditing={isEditing}
                toggle={toggleBindDevice}
                toggleUnBindDevice={toggleUnBindDevice}
              />
            </Modal>
            <Modal
              title="QR Code"
              toggle={toggleGenerateQr}
              isShown={isShownGenerateQr}
            >
              <GenerateQR data={data} toggle={toggleGenerateQr} />
            </Modal>
            <Modal
              title="Delete Machine"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={`Deleting "${data.name}" will result in its permanent deletion from the system, impacting all associated data related to this Machine.`}
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pt-2 pb-0">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleDelete}
                    // disabled={isLoadingDeletingAlert}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    Delete
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Modal>
            {isEditing && (
              <Modal
                title="Unbind Device"
                toggle={toggleUnBindDevice}
                isShown={isShownUnBindDevice}
                description={`Unbinding "${data.device.name}" from the Machine "${data.name}" will detach the device and have consequences to this machine.`}
              >
                <DrawerFooter className="flex flex-row justify-end gap-4 pt-2 pb-0">
                  <DrawerClose asChild>
                    <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      onClick={handleUnBindDevice}
                      className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                    >
                      Unbind
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </Modal>
            )}
            <DropdownComponent
              menuItems={actionsDropdown}
              placeholder="Action"
              buttonClassName="w-[120px]"
            />
            <Button
              onClick={() => toggleDelete()}
              className="bg-transparent hover:bg-rs-v2-red p-[5px] text-rs-v2-red hover:text-white"
            >
              <MdDeleteOutline size={24} />
            </Button>
          </DivPropagationWrapper>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <TopBar title="Management Machine" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal
          title="Manage Group"
          toggle={toggleManageGroup}
          isShown={isShownManageGroup}
        >
          <ManageMachineGroupForm toggle={toggleManageGroup} />
        </Modal>
        <Modal
          title="Add Group"
          toggle={toggleAddGroup}
          isShown={isShownAddGroup}
        >
          <NewMachineGroupForm toggle={toggleAddGroup} />
        </Modal>
        <Modal title="Add Machine" toggle={toggle} isShown={isShown}>
          <MachineForm toggle={toggle} />
        </Modal>
        <div className="w-full">
          <BaseTable
            data={machineDataMemo}
            columns={machineColumns}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
            onSearchInput
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            quickAccessToolbarChildren={
              <Fragment>
                <MdRefresh
                  onClick={() => {
                    toast(
                      generateDynamicToastMessage({
                        title: 'Success',
                        description: 'Data Fetched successfully',
                        variant: 'success',
                      }),
                    );
                  }}
                  className="w-7 h-7 text-rs-v2-mint cursor-pointer"
                />
                <DropdownMachineGroup
                  handleManageGroup={() => toggleManageGroup()}
                  handleNewGroup={() => toggleAddGroup()}
                  options={machineGroupDataMemo}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </Fragment>
            }
            meta={dataMeta}
            backendPagination={
              dataMeta ? (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataMeta}
                  setLimit={setLimit}
                />
              ) : (
                <></>
              )
            }
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggle()}
              >
                Add Machine <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
            isLoading={loading}
            renderExpansion={(row) => (
              <MachineBindRecipeExpansionTable {...row} />
            )}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MachinePage;
