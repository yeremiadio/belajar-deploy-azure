import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { UnverifiedIcon, VerifiedIcon } from '@/assets/images';
import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import DropdownComponent from '@/components/Dropdown';
import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import Modal from '@/components/Modal';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { loadCookie } from '@/services/cookie';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useResendVerificationEmailMutation,
  useResertpasswordMutation,
} from '@/stores/managementStore/userStore';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IUserData } from '@/types/api/user';
import { constructProperName } from '@/utils/functions/constractProperName';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useUserType from '@/utils/hooks/auth/useUserType';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import { ColumnDef } from '@tanstack/react-table';

import PermissionForm from './_component/userForm/PermissionForm';
import UserForm from './_component/userForm/userForm';

const AccountPage = () => {
  const htmlId = 'managementUserId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const companyIdCookie = loadCookie('companyId');
  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const currentUserType = useUserType();

  // options
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      { isPaginated: false },
      { skip: currentUserType !== 'systemadmin' },
    );

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchUserParams = searchParams.get('search');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchUserParams ?? '',
  );
  const debouncedSearch = useDebounce(inputSearch, 1500);

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
    companyId:
      currentUserType !== 'systemadmin' ? companyIdCookie : selectedCompanyId,
  });

  const { data, isLoading, isFetching } = useGetUserQuery(activeFilter);

  const loading = isLoading || isFetching;

  const userDataMemo = useMemo<IUserData[]>(() => {
    if (!data) return [];
    const userList = data.entities.slice();
    return userList;
  }, [data]);

  const dataUserMeta = useMemo(() => {
    return data?.meta;
  }, [data]);

  const columns: ColumnDef<IUserData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row: { original: data } }) => {
        return (
          <>
            {data ? constructProperName(data?.firstname, data?.lastname) : '-'}
          </>
        );
      },
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row: { original: data } }) => {
        return (
          <>
            {data ? data.company.name : '-'}
          </>
        );
      },
    },
    {
      accessorKey: 'usertype',
      header: 'Role',
      cell: ({ row: { original } }) => original.usertype?.name ?? '-',
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row: { original } }) => original.username ?? '-',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }) => {
        const val = original.emailVerified ?? false;
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
              <div className="flex justify-center gap-8">
                {original.email}
                <img
                  src={UnverifiedIcon}
                  className="ml-auto w-[16px] h-[16px]"
                />
              </div>
            );
        }
      },
    },
    {
      accessorKey: 'phonenumber',
      header: 'Whatsapp Number',
      cell: ({ row: { original } }) => {
        const val = original.phoneVerified ?? false;
        switch (val) {
          case true:
            return (
              <div className="flex justify-center gap-8">
                {original.phonenumber}
                <img src={VerifiedIcon} className="ml-auto w-[16px] h-[16px]" />
              </div>
            );
          default:
            return (
              <div className="flex justify-center gap-8">
                {original.phonenumber}
                <img
                  src={UnverifiedIcon}
                  style={{ marginLeft: 'auto', height: 16, width: 16 }}
                />
              </div>
            );
        }
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const [deleteUser, { isLoading: isLoadingDeletingUser }] =
          useDeleteUserMutation();
        const [resetpassword] = useResertpasswordMutation();
        const [resendVerificationEmail] = useResendVerificationEmailMutation();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: togglePermission, isShown: isShownPermission } =
          useModal();
        const { toggle: toggleResetPassword, isShown: isShownResetPassword } =
          useModal();
        const { toggle: toggleVerify, isShown: isShownVerify } = useModal();
        const actionsDropdown = [
          { label: 'Edit Account', onClick: () => toggleEdit() },
          { label: 'Edit Permission', onClick: () => togglePermission() },
          { label: 'Reset Password', onClick: () => toggleResetPassword() },
          { label: 'Verify Account', onClick: () => toggleVerify() },
        ];
        const handleDeleteUser = () => {
          deleteUser({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success!',
                  description: 'User deleted successfully',
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

        const handleResetPassword = (event: FormEvent) => {
          event.preventDefault();
          resetpassword({ id: data.id })
            .unwrap()
            .then(() => {
              toggleResetPassword();
              toast(
                generateDynamicToastMessage({
                  title: 'Success!',
                  description: 'Password has been reset',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              toggleResetPassword();
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

        const handleResetEmail = (event: FormEvent) => {
          event.preventDefault();
          resendVerificationEmail({ id: data.id })
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
            <Modal title="Edit User" toggle={toggleEdit} isShown={isShownEdit}>
              <UserForm toggle={toggleEdit} isEditing data={data} />
            </Modal>
            <Modal
              maxWidth="bg-rs-v2-navy-blue sm:max-w-[625px]"
              title="Edit Permission"
              toggle={togglePermission}
              isShown={isShownPermission}
            >
              <PermissionForm toggle={togglePermission} isEditing data={data} />
            </Modal>
            <Modal
              title="Reset Password"
              toggle={toggleResetPassword}
              isShown={isShownResetPassword}
            >
              <form id="resetForm" onSubmit={handleResetPassword}>
                <>
                  Resetting Password this account&nbsp;'{data.username}
                  '&nbsp;will make the account password back to default
                  password.
                </>
                <DrawerSubmitAction
                  submitText="Reset"
                  toggle={toggleResetPassword}
                  form="resetForm"
                  className="bg-rs-alert-yellow"
                />
              </form>
            </Modal>
            <Modal
              title="Verify Account"
              toggle={toggleVerify}
              isShown={isShownVerify}
            >
              <form id="verifyForm" onSubmit={handleResetEmail}>
                <>
                  Rapidsense detected that this account has not verify its email
                  or Whatsapp number in 1 day since the verification link sent.
                  Would you like to re-sent the verification link?
                </>
                <DrawerFooter className="flex flex-row justify-end gap-4 mt-2 pt-2 pr-0 pb-0">
                  <Button
                    type="button"
                    onClick={() => toggleVerify()}
                    className="btn-primary-green hover:hover-btn-primary-green disabled:disabled-btn-disabled-slate-blue"
                    disabled
                  >
                    Resend to Whatsapp
                  </Button>
                  <Button
                    disabled={data.emailVerified}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded font-bold text-white"
                  >
                    Resend to Email
                  </Button>
                </DrawerFooter>
              </form>
            </Modal>
            <Modal
              title="Delete User"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description="Are you sure want to delete this User?"
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pt-2 pb-0">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleDeleteUser}
                    disabled={isLoadingDeletingUser}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    {isLoadingDeletingUser ? (
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
    <PageWrapper>
      <TopBar title="Management Account" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal title="Add Account" toggle={toggle} isShown={isShown}>
          <UserForm toggle={toggle} />
        </Modal>
        <div className="w-full">
          <BaseTable
            data={userDataMemo}
            meta={dataUserMeta}
            columns={columns}
            hideColumns={currentUserType !== 'systemadmin' ? ['company'] : []}
            isFullWidth
            onExportButton
            exportName="user"
            onSearchInput
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            isLoading={loading}
            backendPagination={
              dataUserMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataUserMeta}
                  setLimit={setLimit}
                />
              )
            }
            additionalPrefixToolbarElement={
              currentUserType === 'systemadmin' ? (
                <SelectComponent
                  allowClear
                  options={companyOptions}
                  value={selectedCompanyId}
                  labelRender={({ label }) => (
                    <p className="max-w-32 text-ellipsis whitespace-nowrap overflow-hidden">
                      {label}
                    </p>
                  )}
                  containerClassName="w-fit"
                  className="rc-select--navy-blue"
                  placeholder="Search Company..."
                  loading={isLoadingCompanyOptions}
                  onChange={(value) => setSelectedCompanyId(value)}
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
                Add Account <AiOutlinePlus className="ml-2" />
              </Button>
            }
          />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AccountPage;
