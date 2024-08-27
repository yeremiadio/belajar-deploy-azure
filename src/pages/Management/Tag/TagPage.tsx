import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
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
import { cn } from '@/lib/utils';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteTagMutation,
  useGetTagQuery,
  useResetTagMutation,
} from '@/stores/managementStore/tagStore/tagStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { ITagObjResponse } from '@/types/api/management/tag';
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
import TagForm from './_components/Forms/TagForm';

const TagPage = () => {
  const htmlId = 'managementTagId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle, isShown } = useModal();
  const { toast } = useToast();
  const currentUserType = useUserType();

  // options
  const { arr: companyOptions, isLoading: isLoadingCompanyOptions } =
    useCompanyOpts(
      { isPaginated: false },
      {
        skip: currentUserType !== 'systemadmin',
      },
    );

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchLocationParams = searchParams.get('search');
  const selectedCompanyIdParams = searchParams.get('companyId');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [inputSearch, setInputSearch] = useState<string>(
    searchLocationParams ?? '',
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
    isShowAll: true,
    companyId: selectedCompanyId ?? undefined,
  });

  const { data: tagData } = useGetTagQuery(activeFilter);

  const dataTagsMeta = useMemo(() => {
    return tagData?.meta;
  }, [tagData]);

  const tagsMemo = useMemo<ITagObjResponse[]>(() => {
    if (!tagData) return [];
    const tagList = tagData.entities.slice();
    return tagList;
  }, [tagData]);

  const columns: ColumnDef<ITagObjResponse>[] = [
    {
      accessorKey: 'name',
      id: 'tagDevice',
      header: 'Tag Device',
      minSize: 1000,
    },
    {
      accessorKey: 'relation',
      id: 'relation',
      header: 'Relation',
      minSize: 1000,
    },
    {
      accessorKey: 'id',
      id: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const data = row.original;
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleReset, isShown: isShownReset } = useModal();
        const [deleteTag] = useDeleteTagMutation();
        const [resetTag] = useResetTagMutation();

        const handleDelete = () => {
          deleteTag({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Tag ${data.name} deleted successfully`,
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

        const handleReset = () => {
          resetTag({ id: data.id })
            .unwrap()
            .then(() => {
              toast(
                generateDynamicToastMessage({
                  title: 'Success',
                  description: `Tag ${data.name} reseted successfully`,
                  variant: 'success',
                }),
              );
              toggleReset();
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
              toggleReset();
            });
        };

        return (
          <DivPropagationWrapper>
            <Modal
              title="Reset Tag"
              toggle={toggleReset}
              isShown={isShownReset}
              description={
                <p>
                  By resetting the tag "{`${data.name}`}" any association
                  between this tag and the others will be eliminated.
                </p>
              }
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 px-0 pb-0 pt-2">
                <DrawerClose>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerTrigger>
                  <Button
                    className="btn-warning hover:hover-btn-warning"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </DrawerTrigger>
              </DrawerFooter>
            </Modal>
            <Modal title="Edit Tag" toggle={toggleEdit} isShown={isShownEdit}>
              <TagForm isEditing toggle={toggleEdit} data={data} id={data.id} />
            </Modal>
            <Modal
              title="Delete Tag"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={
                <p>
                  Deleting "{`${data.name}`}" will result in its{' '}
                  <b>permanent</b> deletion from the system, impacting all
                  associated data related to this Tag.
                </p>
              }
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 px-0 pb-0 pt-2">
                <DrawerClose>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerTrigger>
                  <Button
                    className="btn-primary-danger hover:hover-btn-primary-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </DrawerTrigger>
              </DrawerFooter>
            </Modal>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  toggleEdit();
                }}
                dataTestId="buttonEditTag"
                className="btn-secondary-navy-blue hover:hover-btn-secondary-navy-blue"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  toggleReset();
                }}
                dataTestId="buttonResetTag"
                disabled={data.relation === '-'}
                className={cn(
                  data.relation !== '-'
                    ? 'btn-warning hover:hover-btn-warning'
                    : 'btn-terinary-gray hover:hover-btn-terinary-gray',
                )}
              >
                Reset
              </Button>

              <div className="inline-flex">
                <Button
                  dataTestId="buttonDeleteTag"
                  onClick={() => toggleDelete()}
                  disabled={data.relation !== '-'}
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
      <TopBar title="Management Tag" isFloating={false} />
      <Modal title="Add Tag" toggle={toggle} isShown={isShown}>
        <TagForm toggle={toggle} />
      </Modal>
      <ContentWrapper id={htmlId}>
        <div className="w-full">
          <BaseTable
            data={tagsMemo ?? []}
            columns={columns}
            onSearchInput
            meta={dataTagsMeta}
            name="tagTable"
            exportText="Export to CSV"
            exportName="tag"
            onExportButton
            backendPagination={
              dataTagsMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={dataTagsMeta}
                  setLimit={setLimit}
                />
              )
            }
            onSearchInputChange={setInputSearch}
            searchInputValue={inputSearch}
            withToolbar
            additionalPrefixToolbarElement={
              currentUserType === 'systemadmin' ? (
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
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggle()}
              >
                Add Tag <AiOutlinePlus className="ml-2" />
              </Button>
            }
            isFullWidth
          />
        </div>

        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default TagPage;
