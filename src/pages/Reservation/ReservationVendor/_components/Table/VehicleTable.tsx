import { ColumnDef } from '@tanstack/react-table';
import { FC, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdClose, MdDeleteOutline, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TLicensePlate } from '@/types/api/reservation';

import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';

import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import InputComponent from '@/components/InputComponent';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import VehicleForm from '@/pages/Reservation/ReservationVendor/_components/Form/VehicleForm';
import TabSwitch from '@/pages/Reservation/ReservationVendor/_components/TabSwitch';

import { useDeleteLicensePlateMutation, useGetLicensePlatesQuery } from '@/stores/licensePlateStore/licensePlateStoreApi';

import convertTitleCase from '@/utils/functions/convertTitleCase';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';


type Props = {
  viewParameter: string | null;
  handleClickViewParameter: (view: 'vendor' | 'vehicle' | 'driver') => void;
};

const VehicleTable: FC<Props> = ({
  viewParameter,
  handleClickViewParameter,
}) => {
  const { toast } = useToast();
  const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
  const { toggle: toggleAdd, isShown: isShownAdd } =
  useModal();
 
  const [selectedDataVehicle, setSelectedDataVehicle] = useState<
    TLicensePlate | undefined
  >();

  const [searchParams, setSearchParams] = useSearchParams();
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchValue, setSearchValue] = useState<string>('');
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

  const { data: vehicleData, isLoading: isLoadingVehicleData } =
  useGetLicensePlatesQuery({
      ...activeFilter,
      isPaginated: true
    });

  const vehicleDataMemo = useMemo(() => {
    if (!vehicleData) {
      return [];
    }
    const data = vehicleData?.entities;
    return data;
  }, [vehicleData]);

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

  const vehicleColumns: ColumnDef<TLicensePlate>[] = [
    {
      header: 'License Plate',
      accessorKey: 'plate',
      cell: ({ row: { original } }) => original.plate ?? '-',
    },
    {
      header: 'Class',
      accessorKey: 'class',
      cell: ({ row: { original } }) => original.class ? convertTitleCase(original.class) : '-',
    },
    {
      header: 'Merk',
      accessorKey: 'merk',
      cell: ({ row: { original } }) => original.merk ?? '-',
    },
    {
      header: 'Series',
      accessorKey: 'series',
      cell: ({ row: { original } }) => original.series ?? '-',
    },
    {
      header: 'Annotation',
      accessorKey: 'annotation',
      cell: ({ row: { original } }) => original.annotation ?? '-',
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: ({ row }) => {
        const data = row.original;
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const [deleteVehicle] = useDeleteLicensePlateMutation();
        const handleDelete = async () => {
          await deleteVehicle({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Vehicle (plate number: ${data.plate}) deleted successfully`,
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
              title="Delete Vehicle"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <span>
                  Deleting "{data.plate}" will result in it's <b>permanent</b>{' '}
                  deletion from the system, impacting all associated data
                  related to this Vehicle.
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
                    setSelectedDataVehicle(data);
                  }}
                  className="bg-gray-800 btn-bg-gray-800 hover:bg-gray-700 text-white hover:text-gray-300"
                >
                  Edit Vehicle
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
        title="Edit Vehicle"
        toggle={toggleEdit}
        isShown={isShownEdit}
      >
        <VehicleForm
            toggle={toggleEdit}
            isEditing={true}
            data={selectedDataVehicle}
          />
      </Modal>
      <Modal
        title="Add Vehicle"
        toggle={toggleAdd}
        isShown={isShownAdd}
      >
         <VehicleForm  toggle={toggleAdd}/>
      </Modal>

      <BaseTable
        data={vehicleDataMemo}
        columns={vehicleColumns}
        isShowNumbering
        onExportButton
        exportName="license-plates"
        isFullWidth
        withToolbar
        additionalPrefixToolbarElement={
          <>
            <TabSwitch
              handleViewChange={(view) => {
                handleClickViewParameter(view)
              }
              }
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
           Add Vehicle <AiOutlinePlus className="ml-2" />
          </Button>
        }
        isLoading={isLoadingVehicleData}
        meta={vehicleData?.meta}
        backendPagination={
          vehicleData?.meta && (
            <TableBackendPagination
              page={page}
              take={take}
              setPage={setPage}
              meta={vehicleData.meta}
              setLimit={setLimit}
            />
          )
        }
      />
    </>
  );
};

export default VehicleTable;
