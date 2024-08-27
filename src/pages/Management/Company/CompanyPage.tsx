import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import GroupTableButton from '@/components/Wrapper/ButtonWrapper/GroupTableButton';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';

import {
  useDeleteCompanyMutation,
  useGetCompaniesV2Query,
} from '@/stores/managementStore/companyStore/companyStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { ICompany } from '@/types/api/management/company';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';

import CompanyForm from './_components/CompanyForm';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

const CompanyPage = () => {
  const htmlId = 'managementUserId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle, isShown } = useModal();
  const { toast } = useToast();

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchNameParams = searchParams.get('name');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchNameParams ?? '',
  );
  const debouncedSearchName = useDebounce(inputSearch, 500);

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  // re-assign params
  useEffect(() => {
    if (debouncedSearchName && debouncedSearchName.length > 1) {
      searchParams.set('name', debouncedSearchName);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('name');
    }
    setSearchParams(searchParams);
  }, [debouncedSearchName]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    name: debouncedSearchName,
  });

  const { data, isLoading, isFetching } = useGetCompaniesV2Query(activeFilter);
  const loading = isLoading || isFetching;

  const companyDataMemo = useMemo<ICompany[]>(() => {
    if (!data) return [];
    const companyList = data.entities.slice();
    return companyList;
  }, [data]);

  const dataCompanyMeta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const columns: ColumnDef<ICompany>[] = [
    {
      accessorKey: 'name',
      header: 'Company',
      cell: ({ row: { original } }) => original.name ?? '-',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row: { original } }) => original.description ?? '-',
    },
    {
      accessorKey: 'module',
      header: 'Module',
      cell: ({ row }) => {
        const { modules } = row.original;
        return (
          <div className="flex flex-wrap items-center gap-1">
            <GroupTableButton groups={modules} />
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const [deleteCompany, { isLoading: isLoadingDeletingAlert }] =
          useDeleteCompanyMutation();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();

        const handleDeleteCompany = () => {
          deleteCompany({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success!',
                  description: 'Company deleted successfully',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              toggleDelete();
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
              title="Edit Company"
              toggle={toggleEdit}
              isShown={isShownEdit}
            >
              <CompanyForm toggle={toggleEdit} isEditing data={data} />
            </Modal>
            <Modal
              title="Delete Company"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description="Are you sure want to delete this company?"
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleDeleteCompany}
                    disabled={isLoadingDeletingAlert}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    {isLoadingDeletingAlert ? (
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
                    toggleEdit();
                  }}
                  className="btn-bg-gray-800 bg-gray-800 text-white hover:bg-gray-700 hover:text-gray-300"
                >
                  Edit Company
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

  return (
    <PageWrapper>
      <TopBar title="Management Company" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal title="Add Company" toggle={toggle} isShown={isShown}>
          <CompanyForm toggle={toggle} />
        </Modal>
        <div className="w-full">
          <BaseTable
            data={companyDataMemo}
            meta={dataCompanyMeta}
            columns={columns}
            isFullWidth
            onExportButton
            exportName="company"
            onSearchInput
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            isLoading={loading}
            backendPagination={
              dataCompanyMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataCompanyMeta}
                  setLimit={setLimit}
                />
              )
            }
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggle()}
              >
                Add Company <AiOutlinePlus className="ml-2" />
              </Button>
            }
          />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default CompanyPage;
