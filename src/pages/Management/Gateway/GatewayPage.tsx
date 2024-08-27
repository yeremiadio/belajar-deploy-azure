import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import SelectComponent from '@/components/Select';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import GatewayForm from '@/pages/Management/Gateway/components/GatewayForm';

import {
  useDeleteGatewayMutation,
  useGetGatewayListQuery,
} from '@/stores/managementStore/gatewayStoreApi';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { IGateway } from '@/types/api/management/gateway';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';

import { useDebounce } from '@/utils/hooks/useDebounce';
import useElementDimensions from '@/utils/hooks/useElementDimension';
import { useModal } from '@/utils/hooks/useModal';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import { loadCookie } from '@/services/cookie';

const GatewayPage = () => {
  const htmlId = 'managementGatewayId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const companyIdCookie = loadCookie('companyId');
  const { toast } = useToast();
  const { toggle: toggleAddModal, isShown: isAddModalShown } = useModal();
  const currentUserType = useUserType();

  const topElementRef = useRef<HTMLDivElement>(null);
  const topElementDimension = useElementDimensions(topElementRef);
  const occupiedHeight = topElementDimension.height + 42;

  // options
  const { arr: companyOpts, isLoading: isLoadingCompanyOpts } = useCompanyOpts(
    { isPaginated: false },
    { skip: currentUserType !== 'systemadmin' },
  );

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchNameParams = searchParams.get('name');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchName, setSearchName] = useState<string>(searchNameParams ?? '');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    selectedCompanyIdParams ? Number(selectedCompanyIdParams) : null,
  );

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
    companyId:
      currentUserType !== 'systemadmin' ? companyIdCookie : selectedCompanyId,
  });

  const { data: gatewayList, isLoading } = useGetGatewayListQuery(activeFilter);

  const gatewayListMemo = useMemo(() => {
    if (!gatewayList || !gatewayList.entities) return [];

    const data = gatewayList.entities.slice();
    return data;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayList]);

  const columns: ColumnDef<IGateway>[] = [
    {
      accessorKey: 'name',
      header: 'Gateway Name',
      cell: ({ row: { original } }) => {
        return `${original?.name ?? '-'}`;
      },
    },
    {
      accessorKey: 'module',
      header: 'Gateway Theme',
      cell: ({ row: { original } }) => {
        return `${original?.module?.name ?? '-'}`;
      },
    },
    {
      accessorKey: 'apikey',
      header: 'Api Key',
      cell: ({ row: { original } }) => {
        const [toggleShowApikey, setToggleShowApikey] = useState(false);

        return (
          <div className="flex items-center">
            <span>
              {toggleShowApikey ? original.apikey : '**********************'}
            </span>
            <Button
              className="hover:bg-rs-v2-blue text-rs-v2-blue bg-transparent p-[5px] hover:text-white"
              onClick={() => setToggleShowApikey((prev) => !prev)}
            >
              {toggleShowApikey ? <LuEyeOff /> : <LuEye />}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'companyId',
      header: 'Company',
      cell: ({ row: { original } }) => {
        return `${original?.company?.name}`;
      },
    },
    {
      header: 'Location',
      cell: ({ row: { original } }) => {
        return `${original?.location?.name ?? '-'}`;
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const { toggle: toggleEditModal, isShown: isEditModalShown } =
          useModal();
        const { toggle: toggleDeleteModal, isShown: isDeleteModalShown } =
          useModal();
        const [deleteGateway] = useDeleteGatewayMutation();

        const handleDeleteGateway = () => {
          deleteGateway(original.id)
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Gateway ${original.name} deleted successfully`,
                  variant: 'success',
                }),
              );
              toggleDeleteModal();
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
              toggleDeleteModal();
            });
        };

        return (
          <DivPropagationWrapper>
            <Modal
              title="Edit Gateway"
              toggle={toggleEditModal}
              isShown={isEditModalShown}
              description=""
            >
              <GatewayForm toggle={toggleEditModal} isEditing data={original} />
            </Modal>
            <Modal
              title="Delete Gateway"
              toggle={toggleDeleteModal}
              isShown={isDeleteModalShown}
              description="Are you sure want to delete this Gateway?"
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 px-0 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerTrigger asChild>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDeleteGateway}
                  >
                    Delete
                  </Button>
                </DrawerTrigger>
              </DrawerFooter>
            </Modal>

            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={() => {
                  toggleEditModal();
                }}
                className="btn-primary-green hover:hover-btn-primary-green"
              >
                Edit Gateway
              </Button>
              <div className="inline-flex">
                <Button
                  onClick={() => toggleDeleteModal()}
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
      <TopBar
        title="Management Gateway"
        isFloating={false}
        topBarRef={topElementRef}
      />
      <ContentWrapper id={htmlId}>
        <Modal
          title="Add Gateway"
          toggle={toggleAddModal}
          isShown={isAddModalShown}
          description=""
        >
          <GatewayForm toggle={toggleAddModal} />
        </Modal>

        <div
          className="relative w-full overflow-auto p-1"
          style={{
            height: `calc(100vh - (${occupiedHeight}px)`,
          }}
        >
          <BaseTable
            name="gatewayTable"
            data={gatewayListMemo}
            columns={columns}
            onExportButton
            exportName="gateway"
            onSearchInput
            onSearchInputChange={setSearchName}
            searchInputValue={searchName}
            withToolbar
            meta={gatewayList && gatewayList.meta}
            isLoading={isLoading}
            additionalPrefixToolbarElement={
              <SelectComponent
                allowClear
                options={companyOpts}
                value={selectedCompanyId}
                containerClassName="w-fit"
                className="rc-select--navy-blue"
                placeholder="Search Company..."
                loading={isLoadingCompanyOpts}
                onChange={(value) => setSelectedCompanyId(value)}
                labelRender={({ label }) => (
                  <p className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                    {label}
                  </p>
                )}
              />
            }
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggleAddModal()}
              >
                Add Gateway <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
            backendPagination={
              gatewayList && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  setLimit={setLimit}
                  meta={gatewayList.meta}
                />
              )
            }
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GatewayPage;
