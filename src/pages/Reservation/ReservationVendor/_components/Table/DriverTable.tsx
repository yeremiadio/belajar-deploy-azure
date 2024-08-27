import { ColumnDef } from '@tanstack/react-table';
import { FC, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdClose, MdDeleteOutline, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import InputComponent from '@/components/InputComponent';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import DriverForm from '@/pages/Reservation/ReservationVendor/_components/Form/DriverForm';
import TabSwitch from '@/pages/Reservation/ReservationVendor/_components/TabSwitch';

import { useDeleteDriverMutation, useGetDriversQuery } from '@/stores/driverStore/driverStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TDriver } from '@/types/api/reservation';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';


type Props = {
  viewParameter: string | null;
  handleClickViewParameter: (view: 'vendor' | 'vehicle' | 'driver') => void;
};

const DriverTable: FC<Props> = ({
  viewParameter,
  handleClickViewParameter,
}) => {
  const { toast } = useToast();
  const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
  const { toggle: toggleAdd, isShown: isShownAdd } =
  useModal();
 
  const [selectedDataDriver, setSelectedDataDriver] = useState<
    TDriver | undefined
  >();

  const [searchParams, setSearchParams] = useSearchParams();
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    search: debouncedSearch,
  });

  const { data: driverData, isLoading: isLoadingDriverData } =
    useGetDriversQuery({
      ...activeFilter,
      isPaginated: true
    });

  const driverDataMemo = useMemo(() => {
    if (!driverData) {
      return [];
    }
    const data = driverData?.entities;
    return data;
  }, [driverData]);

  useEffect(() => {
    if (viewParameter) {
      searchParams.set('view', viewParameter);
    } else {
      searchParams.set('view', 'vendor');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }, [viewParameter]);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      searchParams.set('search', debouncedSearch);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  }, [debouncedSearch]);

  const driverColumns: ColumnDef<TDriver>[] = [
    {
      header: 'Driver Name',
      accessorKey: 'name',
      cell: ({ row: { original } }) => original.name ?? '-',
    },
    {
      header: 'Identity',
      accessorKey: 'identity',
      cell: ({row}) => {
        const identityNumber = row.original.identityNumber;
        const identity = row.original.identity;
        return <>{identity? `${identity} - ${identityNumber}` : '-'}</>
      }
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row: { original } }) => original.email ?? '-',
    },
    {
      header: 'Nomor HP',
      accessorKey: 'phoneNumber',
      cell: ({ row: { original } }) => original.phoneNumber ?? '-',
    },

    {
      header: 'Action',
      accessorKey: 'id',
      cell: ({ row }) => {
        const data = row.original;
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const [deleteDriver] = useDeleteDriverMutation();
        const handleDelete = async () => {
          await deleteDriver({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Driver (id: ${data.name}) deleted successfully`,
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
              title="Delete Driver"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <span>
                  Deleting "{data.name}" will result in it's <b>permanent</b>{' '}
                  deletion from the system, impacting all associated data
                  related to this Driver.
                </span>
              }
            >
              <div className="flex flex-row justify-end gap-4 px-0 pt-2 pb-0">
                <div>
                  <Button
                    onClick={() => toggleDelete()}
                    className="btn-terinary-gray hover:hover-btn-terinary-gray"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDelete}
                    type="button"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>
            <div className="flex justify-between items-center gap-2">
              <div className="inline-flex">
              <Button
                  onClick={() => {
                    toggleEdit();
                    setSelectedDataDriver(data);
                  }}
                  className="bg-gray-800 btn-bg-gray-800 hover:bg-gray-700 text-white hover:text-gray-300"
                >
                  Edit Driver
                </Button>
                <Button
                  onClick={() => toggleDelete()}
                  className="bg-transparent hover:bg-rs-v2-red p-[5px] text-rs-v2-red hover:text-white"
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

  return (
    <>
      <Modal
        title="Edit Driver"
        toggle={toggleEdit}
        isShown={isShownEdit}
      >
        <DriverForm
            toggle={toggleEdit}
            isEditing={true}
            data={selectedDataDriver}
          />
      </Modal>
      <Modal
        title="Add Driver"
        toggle={toggleAdd}
        isShown={isShownAdd}
      >
         <DriverForm  toggle={toggleAdd}/>
      </Modal>

      <BaseTable
        data={driverDataMemo}
        columns={driverColumns}
        isShowNumbering
        onExportButton
        exportName="drivers"
        isFullWidth
        withToolbar
        additionalPrefixToolbarElement={
          <>
            <TabSwitch
              handleViewChange={(view) => {
                handleClickViewParameter(view)
              }}
              viewParameter={viewParameter}
            />
            <InputComponent
              containerStyle="w-[150px]"
              addonRight={
                searchValue.length > 0 ? (
                  <MdClose
                    size={24}
                    className="cursor-pointer"
                    onClick={() => setSearchValue('')}
                  />
                ) : (
                  <MdSearch
                    size={24}
                    className={cn(
                      searchValue && searchValue.length > 0 && 'hidden',
                    )}
                  />
                )
              }
              className="border-[1px] bg-rs-v2-galaxy-blue p-2 border-rs-v2-thunder-blue h-12"
              type="search"
              value={searchValue}
              placeholder="Search..."
              onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
            />
          </>
        }
        additionalSuffixToolbarElement={
          <Button
            className="btn-primary-mint hover:hover-btn-primary-mint"
            onClick={() => toggleAdd()}
          >
           Add Driver <AiOutlinePlus className="ml-2" />
          </Button>
        }
        isLoading={isLoadingDriverData}
        meta={driverData?.meta}
        backendPagination={
          driverData?.meta && (
            <TableBackendPagination
              page={page}
              take={take}
              setPage={setPage}
              meta={driverData.meta}
              setLimit={setLimit}
            />
          )
        }
      />
    </>
  );
};

export default DriverTable;
