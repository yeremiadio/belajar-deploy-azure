import { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import Checkbox from '@/components/Checkbox';
import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import SwitchComponent from '@/components/Switch';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import {
  useDeleteAlertMutation,
  useGetAlertsQuery,
  useToggleAlertStatusMutation,
  useToggleEmailAlertStatusMutation,
  useToggleWhatsappAlertStatusMutation,
} from '@/stores/alertStore/alertStoreApi';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { IAlert } from '@/types/api/management/alert';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import transformThresholdAlertValue from '@/utils/functions/transformThresholdAlertValue';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

import AlertDeviceRelationsTable from './_components/AlertDeviceRelationsTable';
import AlertDotCircle from './_components/AlertDotCircle';
import AlertForm from './_components/AlertForm';
import BindDeviceForm from './_components/BindDeviceForm';

const AlertPage = () => {
  const htmlId = 'managementAlertId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const userType = useUserType();

  // options
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      { isPaginated: false },
      { skip: userType !== 'systemadmin' },
    );

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchAlertParams = searchParams.get('search');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchAlertParams ?? '',
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    selectedCompanyIdParams ? Number(selectedCompanyIdParams) : null,
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
    search: debouncedSearch,
    companyId: selectedCompanyId ?? undefined,
  });

  const { data, isLoading, isFetching } = useGetAlertsQuery(activeFilter);
  const loading = isLoading || isFetching;

  const alertMemo = useMemo<IAlert[]>(() => {
    if (!data || !data.entities) return [];
    const alertList = data.entities.slice();
    return alertList;
  }, [data]);

  const dataAlertMeta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const columns: ColumnDef<IAlert>[] = [
    {
      accessorKey: 'name',
      header: 'Alert Name',
    },
    {
      accessorKey: 'sensortype',
      header: 'Sensor Name',
      cell: ({ row: { original } }) => original.sensortype.name,
    },
    {
      accessorKey: 'threshold',
      header: 'Threshold',
      cell: ({ row: { original } }) => {
        const { sign, value, sensortype } = original;
        const unit = sensortype.unit;
        return (
          <Fragment>
            {transformThresholdAlertValue(sign, value)} {unit}
          </Fragment>
        );
      },
    },
    {
      accessorKey: 'threatlevel',
      header: 'Alert Name',
      cell: ({ row: { original } }) => (
        <AlertDotCircle threatlevel={original.threatlevel} isShowLabel />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Active',
      cell: ({ row: { original } }) => {
        const isActive = original.status === 1;
        const [toggleStatus] = useToggleAlertStatusMutation();
        const handleCheckStatus = async () => {
          await toggleStatus({ alertId: original.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Status updated successfully',
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
          <DivPropagationWrapper className="flex items-center justify-center">
            <SwitchComponent
              onCheckedChange={() => handleCheckStatus()}
              defaultChecked={isActive}
              value={isActive}
            />
          </DivPropagationWrapper>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }) => {
        const alertData = original;
        const [toggleEmail, { isLoading }] =
          useToggleEmailAlertStatusMutation();
        const isTrue = alertData.status_email === 1 ? true : false;
        const handleCheckStatus = async () => {
          await toggleEmail({ alertId: alertData.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Status updated successfully',
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
            <Checkbox
              disabled={isLoading}
              defaultChecked={isTrue}
              onChange={handleCheckStatus}
            />
          </DivPropagationWrapper>
        );
      },
    },
    {
      accessorKey: 'whatsapp',
      header: 'Whatsapp',
      cell: ({ row: { original } }) => {
        const alertData = original;
        const [toggleWhatsapp, { isLoading }] =
          useToggleWhatsappAlertStatusMutation();
        const isTrue = alertData.status_whatsapp === 1 ? true : false;
        const handleCheckStatus = async () => {
          await toggleWhatsapp({ alertId: alertData.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Status updated successfully',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              toast(
                generateDynamicToastMessage({
                  title: 'Failed',
                  description: `Failed updating status Whatsapp ${error?.data?.message ?? ''}`,
                  variant: 'error',
                }),
              );
            });
        };

        return (
          <DivPropagationWrapper>
            <Checkbox
              disabled={isLoading}
              defaultChecked={isTrue}
              onChange={handleCheckStatus}
            />
          </DivPropagationWrapper>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const [deleteAlert, { isLoading: isLoadingDeletingAlert }] =
          useDeleteAlertMutation();
        const { toggle: toggleBindDevice, isShown: isShownBindDevice } =
          useModal();
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const handleDeleteAlert = () => {
          deleteAlert({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: 'Alert deleted successfully',
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
              title="Bind Device"
              toggle={toggleBindDevice}
              isShown={isShownBindDevice}
            >
              <BindDeviceForm toggle={toggleBindDevice} data={data} />
            </Modal>
            <Modal title="Edit Alert" toggle={toggleEdit} isShown={isShownEdit}>
              <AlertForm toggle={toggleEdit} isEditing data={data} />
            </Modal>
            <Modal
              title="Delete Alert"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description="Are you sure want to delete this alert?"
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleDeleteAlert}
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
              <Button
                onClick={() => {
                  toggleBindDevice();
                }}
                className="btn-primary-green hover:hover-btn-primary-green"
              >
                Bind Device
              </Button>
              <div className="inline-flex">
                <Button
                  onClick={() => toggleEdit()}
                  className="bg-transparent p-[5px] text-rs-baltic-blue hover:bg-rs-baltic-blue hover:text-white"
                >
                  <MdOutlineEdit size={24} />
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
      <TopBar title="Management Alert" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal title="Add Alert" toggle={toggle} isShown={isShown}>
          <AlertForm toggle={toggle} />
        </Modal>

        <div className="w-full">
          <BaseTable
            data={alertMemo}
            columns={columns}
            meta={dataAlertMeta}
            onSearchInput
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
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
                  onChange={(value) => setSelectedCompanyId(value)}
                  labelRender={({ label }) => (
                    <p className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                      {label}
                    </p>
                  )}
                />
              ) : (
                <></>
              )
            }
            backendPagination={
              dataAlertMeta ? (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataAlertMeta}
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
                Add Alert <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
            isLoading={loading}
            renderExpansion={(row) => <AlertDeviceRelationsTable {...row} />}
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AlertPage;
