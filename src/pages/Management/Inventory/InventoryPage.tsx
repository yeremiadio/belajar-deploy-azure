import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline, MdRefresh } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
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
  useDeleteInventoryMutation,
  useGetInventoryGroupsQuery,
  useGetInventoryQuery,
} from '@/stores/managementStore/inventoryStore';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IInventory } from '@/types/api/management/inventory';
import { BasicSelectOpt } from '@/types/global';
import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import { ColumnDef, Row } from '@tanstack/react-table';

import DropdownInventoryGroup from './_components/Form/DropdownInventoryGroup';
import InventoryForm from './_components/Form/InventoryForm';
import ManageGroupPriceForm from './_components/Form/ManageGroupPriceForm';
import ManageInventoryGroupForm from './_components/Form/ManageInventoryGroupForm';
import NewInventoryGroupForm from './_components/Form/NewInventoryGroupForm';
import InventoryGroupsTable from './_components/InventoryGroupsTable';

const InventoryPage = () => {
  const htmlId = 'managementInventoryId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const { toggle: toggleAddGroup, isShown: isShownAddGroup } = useModal();
  const { toggle: toggleManageGroup, isShown: isShownManageGroup } = useModal();

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInventoryParams = searchParams.get('search');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchInventoryParams ?? '',
  );
  const debouncedSearch = useDebounce(inputSearch, 1500);

  const [selectedRows, setSelectedRows] = useState<Row<IInventory>[]>([]);

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
    data: inventoryData,
    isLoading,
    isFetching,
  } = useGetInventoryQuery(activeFilter);
  const loading = isLoading || isFetching;

  const inventoryDataMemo = useMemo<IInventory[]>(() => {
    if (!inventoryData || !inventoryData.entities) return [];
    const list = inventoryData.entities.slice();
    return list;
  }, [inventoryData]);

  const dataMeta = useMemo(() => {
    return inventoryData?.meta;
  }, [inventoryData]);

  const { data: inventoryGroupData } = useGetInventoryGroupsQuery({
    page: 1,
    take: 100,
    isPaginated: false,
    isShow: true,
  });

  const inventoryGroupDataMemo = useMemo<BasicSelectOpt<number>[]>(() => {
    if (!inventoryGroupData || !inventoryGroupData.entities) return [];
    const list = inventoryGroupData.entities.slice();
    const sanitizedData = list.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    return sanitizedData;
  }, [inventoryGroupData]);

  const columnsMemo = useMemo<ColumnDef<IInventory>[]>(() => {
    const column: ColumnDef<IInventory>[] = [
      {
        accessorKey: 'uniqueId',
        id: 'id',
        header: 'Inventory ID',
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Inventory Name',
      },
      {
        accessorKey: 'type',
        id: 'type',
        header: 'Inventory Type',
      },
      {
        accessorKey: 'unit',
        id: 'unit',
        header: 'Unit',
      },
      {
        accessorKey: 'price',
        id: 'price',
        header: 'Default Price',
        cell: ({ row: { original } }) => {
          const defaultPrice = original.price;
          return (
            <>
              {defaultPrice ? convertNumberToStringRupiah(defaultPrice) : '-'}
            </>
          );
        },
      },
      {
        accessorKey: 'group',
        id: 'pricegroup',
        header: 'Pricelist Group',
        cell: ({ row: { original } }) => {
          const { group } = original;
          return (
            <div className="flex flex-wrap items-center gap-1">
              {group.length > 0 ? <GroupTableButton groups={group} /> : '-'}
            </div>
          );
        },
      },
      {
        accessorKey: 'id',
        id: 'action',
        header: 'Action',
        cell: ({ row: { original: data } }) => {
          const disabledButtonPrice = data.group.length === 0 ? true : false;
          const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
          const { toggle: toggleEditInventory, isShown: isShownEditInventory } =
            useModal();
          const { toggle: toggleEditPrice, isShown: isShownEditPrice } =
            useModal();
          const [deleteInventory, { isLoading: isLoadingDeletingInventory }] =
            useDeleteInventoryMutation();
          const handleDelete = async () => {
            await deleteInventory(data.id)
              .unwrap()
              .then(() => {
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: `Inventory ${data.name} deleted successfully`,
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
            <DivPropagationWrapper className="flex flex-wrap items-center gap-2">
              <Modal
                title="Edit Inventory"
                toggle={toggleEditInventory}
                isShown={isShownEditInventory}
              >
                <InventoryForm
                  toggle={toggleEditInventory}
                  isEditing
                  data={data}
                />
              </Modal>
              <Modal
                title="Edit Pricelist Group"
                toggle={toggleEditPrice}
                isShown={isShownEditPrice}
              >
                <ManageGroupPriceForm
                  toggle={toggleEditPrice}
                  isEditing
                  data={data}
                />
              </Modal>
              <Modal
                title="Delete Inventory"
                toggle={toggleDelete}
                isShown={isShownDelete}
                description={`Deleting ${data.uniqueId} will result in its permanent deletion from the system, impacting all associated data related to this Inventory.?`}
              >
                <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                  <DrawerClose asChild>
                    <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      onClick={handleDelete}
                      disabled={isLoadingDeletingInventory}
                      className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                    >
                      {isLoadingDeletingInventory ? (
                        <Spinner
                          size={18}
                          borderWidth={1.5}
                          isFullWidthAndHeight
                        />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </Modal>
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex">
                  <Button
                    onClick={() => {
                      toggleEditInventory();
                    }}
                    className="btn-bg-gray-800 mr-3 bg-gray-800 text-white hover:bg-gray-700 hover:text-gray-300"
                  >
                    Edit Inventory
                  </Button>
                  <Button
                    onClick={() => {
                      toggleEditPrice();
                    }}
                    className="btn-rs-alert-warning bg-rs-alert-warning text-white hover:bg-yellow-500 hover:text-gray-300 disabled:bg-rs-neutral-dark-platinum disabled:opacity-50"
                    disabled={disabledButtonPrice}
                  >
                    Edit Pricelist Group
                  </Button>
                  <Button
                    onClick={() => toggleDelete()}
                    className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                  >
                    <MdDeleteOutline size={24} />
                  </Button>
                </div>
              </div>
            </DivPropagationWrapper>
          );
        },
      },
    ];
    return column;
  }, []);

  return (
    <PageWrapper>
      <TopBar title="Management Inventory" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal
          title="Manage Group"
          toggle={toggleManageGroup}
          isShown={isShownManageGroup}
        >
          <ManageInventoryGroupForm toggle={toggleManageGroup} />
        </Modal>
        <Modal
          title="Add Group"
          toggle={toggleAddGroup}
          isShown={isShownAddGroup}
        >
          <NewInventoryGroupForm toggle={toggleAddGroup} />
        </Modal>
        <Modal title="Add Inventory" toggle={toggle} isShown={isShown}>
          <InventoryForm toggle={toggle} />
        </Modal>
        <div className="w-full">
          <BaseTable
            data={inventoryDataMemo}
            columns={columnsMemo}
            isShowNumbering
            exportText="Export to CSV"
            exportName="inventory"
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onExportButton
            meta={dataMeta}
            onSearchInput
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
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
                Add Inventory <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
            isLoading={loading}
            renderExpansion={(row) => <InventoryGroupsTable {...row} />}
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
                  className="h-7 w-7 cursor-pointer text-rs-v2-mint"
                />
                <DropdownInventoryGroup
                  handleManageGroup={() => toggleManageGroup()}
                  handleNewGroup={() => toggleAddGroup()}
                  options={inventoryGroupDataMemo}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </Fragment>
            }
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default InventoryPage;
