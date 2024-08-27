import { ColumnDef } from '@tanstack/react-table';
import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdClose, MdDeleteOutline, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { VerifiedIcon } from '@/assets/images';

import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import DropdownComponent from '@/components/Dropdown';
import InputComponent from '@/components/InputComponent';
import Modal from '@/components/Modal';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { Button } from '@/components/ui/button';
import { DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import VendorForm from '@/pages/Reservation/ReservationVendor/_components/Form/VendorForm';
import TabSwitch from '@/pages/Reservation/ReservationVendor/_components/TabSwitch';

import { useDeleteVendorMutation, useGetVendorsQuery, useResendVerificationEmailMutation } from '@/stores/vendorStore/vendorStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TVendor } from '@/types/api/reservation';

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

const VendorTable: FC<Props> = ({
  viewParameter,
  handleClickViewParameter,
}) => {
  const { toast } = useToast();
  const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
  const { toggle: toggleAdd, isShown: isShownAdd } =
  useModal();
  const [selectedDataVendor, setSelectedDataVendor] = useState<
    TVendor | undefined
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

  const { data: vendorData, isLoading: isLoadingVendorData } =
    useGetVendorsQuery({
      ...activeFilter,
      isPaginated: true
    });

  const vendorDataMemo = useMemo(() => {
    if (!vendorData) {
      return [];
    }
    const data = vendorData?.entities;
    return data;
  }, [vendorData]);

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

  const vendorColumns: ColumnDef<TVendor>[] = [
    {
      header: 'Vendor',
      accessorKey: 'name',
      cell: ({ row: { original } }) => original.name ?? '-',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      cell: ({ row: { original } }) => original.address ?? '-',
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row: { original } }) => {
        const val = original.isEmailVerified ?? false;
        switch (val) {
          case true:
            return (
              <div className="flex justify-center gap-8">
                {original.email}
                <img src={VerifiedIcon} className="ml-auto w-[16px] h-[16px]" />
              </div>
            );
          default:
            return (
              <>
                {original.email}
                
              </>
            );
        }
      },
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

        const { toggle: toggleVerify, isShown: isShownVerify } = useModal();
        const actionsDropdown = [
          {
            label: 'Edit Vendor',
            onClick: () => {
              toggleEdit();
              setSelectedDataVendor(data);
            },
          },
          { 
            label: 'Verify Vendor', 
            onClick: () => toggleVerify(),
            disabled: data.isEmailVerified
          },
        ];
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const [deleteVendor] = useDeleteVendorMutation();
        const [verifyVendor] = useResendVerificationEmailMutation();
        const handleDelete = async () => {
          await deleteVendor({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Vendor (id: ${data.name}) deleted successfully`,
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

        const handleResendEmailVerification = (event: FormEvent) => {
          event.preventDefault();
          verifyVendor({ id: data.id })
            .unwrap()
            .then(() => {
              toggleVerify();
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Verification link has been sent',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              toggleVerify();
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
              title="Delete Vendor"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <span>
                  Deleting "{data.name}" will result in it's <b>permanent</b>{' '}
                  deletion from the system, impacting all associated data
                  related to this Vendor.
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
            <Modal
              title="Verify Account"
              toggle={toggleVerify}
              isShown={isShownVerify}
            >
              <form id="verifyForm" onSubmit={handleResendEmailVerification}>
                <>
                  Rapidsense detected that this Vendor has not verify its email
                  in 1 day since the verification link sent. Would you like to
                  re-send the verification link?
                </>
                <DrawerFooter className="flex flex-row justify-center mt-2 pt-2 pr-0 pb-0">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded font-bold text-white"
                  >
                    Resend to Email
                  </Button>
                </DrawerFooter>
              </form>
            </Modal>
            <div className="flex justify-between items-center gap-2">
              <div className="inline-flex">
                <DropdownComponent
                  menuItems={actionsDropdown}
                  placeholder="Action"
                />
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
        title="Edit Vendor"
        toggle={toggleEdit}
        isShown={isShownEdit}
      >
         <VendorForm
            toggle={toggleEdit}
            isEditing={true}
            data={selectedDataVendor}
          />
      </Modal>
      <Modal
        title="Add Vendor"
        toggle={toggleAdd}
        isShown={isShownAdd}
      >
        <VendorForm toggle={toggleAdd}/>
      </Modal>

      <BaseTable
        data={vendorDataMemo}
        columns={vendorColumns}
        isShowNumbering
        isFullWidth
        onExportButton
        exportName="vendors"
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
            Add Vendor <AiOutlinePlus className="ml-2" />
          </Button>
        }
        isLoading={isLoadingVendorData}
        meta={vendorData?.meta}
        backendPagination={
          vendorData?.meta && (
            <TableBackendPagination
              page={page}
              take={take}
              setPage={setPage}
              meta={vendorData.meta}
              setLimit={setLimit}
            />
          )
        }
      />
    </>
  );
};

export default VendorTable;
